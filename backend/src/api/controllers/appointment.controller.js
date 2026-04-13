import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";
import calendar from "../../utils/googleCalendar.js";
import {
  sendApprovalEmail,
  sendCancellationEmail,
  notifyAdminNewBooking,
} from "../../utils/email.js";
import {
  addTagToSystemeContactByEmail,
  removeTagFromSystemeContactByEmail,
  updateSystemeContactFieldsByEmail,
} from "../../utils/systeme.js";

const CAMY_COMMISSION_RATE = 0.2;

/* Create appointment (logged in user) */

export const createAppointment = async (req, res) => {
  try {
    const { availabilityId } = req.body;

    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (availability.isBooked) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    const user = await User.findById(req.user._id);

    const freeSessionUsed = await Appointment.findOne({
      user: req.user._id,
      sessionType: "free",
      attendanceStatus: "show_up",
    });

    let sessionType = "free";

    if (freeSessionUsed) {
      sessionType = `paid_${user.paymentCount + 1}`;
    }

    // Protection maximum 4 paid sessions

    if (sessionType.startsWith("paid_") && user.paymentCount >= 4) {
      return res.status(400).json({
        message: "Maximum number of paid sessions reached",
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      availability: availability._id,
      sessionType,
    });

    availability.isBooked = true;
    await availability.save();

    // Email to Ramses

    await notifyAdminNewBooking(
      req.user.email,
      availability.date,
      availability.startHour,
      availability.endHour
    );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* View MY appointments (user) */

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user._id,
    }).populate("availability");

    appointments.sort((a, b) => {
      const dateA = new Date(a.availability.date);
      const dateB = new Date(b.availability.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }

      const hourA = parseInt(a.availability.startHour.split(":")[0]);
      const hourB = parseInt(b.availability.startHour.split(":")[0]);

      return hourA - hourB;
    });

    res.json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* View ALL appointments (admin) */

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email")
      .populate("availability", "date startHour endHour");

    res.json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Update appointment STATUS (admin) */

export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("availability")
      .populate("user", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { status } = req.body;

    if (!["approved", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'approved' or 'cancelled'.",
      });
    }

    appointment.status = status;

    /* If APPROVED → create Google Calendar event */

    if (status === "approved") {
      const availability = appointment.availability;

      const startDate = new Date(availability.date);

      const [startHour, startMinute] = availability.startHour
        .split(":")
        .map(Number);
      const [endHour, endMinute] = availability.endHour.split(":").map(Number);

      const startDateTime = new Date(startDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(startDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      const formattedSessionType =
        appointment.sessionType === "free"
          ? "FREE SESSION"
          : `PAID SESSION ${appointment.sessionType.split("_")[1]}`;

      const googleEvent = await calendar.events.insert({
        calendarId: "ramses.beziehungscoach@gmail.com",
        requestBody: {
          summary: `Coaching Session – ${appointment.user.name}`,
          description: `
      Client: ${appointment.user.name}
      Email: ${appointment.user.email}
      Session Type: ${formattedSessionType}
      Platform: Ramsés Platform
      `,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: "Europe/Berlin",
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "Europe/Berlin",
          },
        },
      });

      appointment.googleEventId = googleEvent.data.id;

      try {
        await sendApprovalEmail(
          appointment.user.email,
          availability.date,
          availability.startHour,
          availability.endHour
        );
      } catch (error) {
        console.log("Email failed:", error.message);
      }

      try {
        // Delete AP_ShowUp

        await removeTagFromSystemeContactByEmail(
          appointment.user.email,
          1947275
        );

        // Add AP_Booked

        await addTagToSystemeContactByEmail(appointment.user.email, 1947325);

        // Update custom fields in Systeme

        const formattedSessionType =
          appointment.sessionType === "free"
            ? "FREE SESSION"
            : `PAID SESSION ${appointment.sessionType.split("_")[1]}`;

        const formattedSessionDate = new Date(
          availability.date
        ).toLocaleDateString("es-ES");

        await updateSystemeContactFieldsByEmail(
          appointment.user.email,
          formattedSessionDate,
          availability.startHour,
          availability.endHour,
          formattedSessionType
        );
      } catch (error) {
        console.log("Systeme tag/fields failed:", error.message);
      }
    }

    /* If CANCELLED → free slot */

    if (status === "cancelled") {
      appointment.availability.isBooked = false;
      await appointment.availability.save();

      try {
        await sendCancellationEmail(appointment.user.email);
      } catch (error) {
        console.log("Email failed:", error.message);
      }
    }

    const updated = await appointment.save();

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Cancel MY appointment (user) */

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "availability"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    /* Delete Google event if exists */

    if (appointment.googleEventId) {
      await calendar.events.delete({
        calendarId: "ramses.beziehungscoach@gmail.com",
        eventId: appointment.googleEventId,
      });
    }

    /* Free slot */

    appointment.availability.isBooked = false;
    await appointment.availability.save();

    await appointment.deleteOne();

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Mark attendance (admin) */

export const markAttendance = async (req, res) => {
  try {
    const { attendanceStatus } = req.body;

    if (!["show_up", "no_show"].includes(attendanceStatus)) {
      return res.status(400).json({
        message: "Invalid attendance status",
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "email paymentCount")
      .populate("availability");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "approved") {
      return res.status(400).json({
        message: "Only approved appointments can be marked",
      });
    }

    if (appointment.attendanceStatus !== "pending") {
      return res.status(400).json({
        message: "Attendance already marked",
      });
    }

    appointment.attendanceStatus = attendanceStatus;
    await appointment.save();

    // Remove AP_Booked

    await removeTagFromSystemeContactByEmail(appointment.user.email, 1947325);

    if (attendanceStatus === "show_up") {
      await addTagToSystemeContactByEmail(appointment.user.email, 1947275);

      if (appointment.user.paymentCount === 0) {
        await addTagToSystemeContactByEmail(appointment.user.email, 1947273);
      }
    }

    if (attendanceStatus === "no_show") {
      await addTagToSystemeContactByEmail(appointment.user.email, 1947274);
    }

    res.json({
      message: "Attendance marked successfully",
      appointment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Mark payment (admin) */

export const markPaidSession = async (req, res) => {
  try {
    const { paidAmount } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "email paymentCount")
      .populate("availability");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.attendanceStatus !== "show_up") {
      return res.status(400).json({
        message: "Only attended appointments can be marked as paid",
      });
    }

    if (appointment.isPaidSessionMarked) {
      return res.status(400).json({
        message: "This appointment has already been used for a paid session",
      });
    }

    if (appointment.user.paymentCount >= 4) {
      return res.status(400).json({
        message: "This lead already reached the maximum of 4 paid sessions",
      });
    }

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        message: "A valid paid amount is required",
      });
    }

    appointment.user.paymentCount += 1;
    await appointment.user.save();

    appointment.isPaidSessionMarked = true;
    appointment.paidAmount = paidAmount;
    appointment.commissionAmount = paidAmount * CAMY_COMMISSION_RATE;
    appointment.paidAt = new Date();

    await appointment.save();

    const paymentTagMap = {
      1: 1947271,
      2: 1947269,
      3: 1947266,
      4: 1947263,
    };

    const tagId = paymentTagMap[appointment.user.paymentCount];

    await addTagToSystemeContactByEmail(appointment.user.email, tagId);

    res.json({
      message: `Payment ${appointment.user.paymentCount} marked successfully`,
      appointment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Get revenue stats (admin) */

export const getRevenueStats = async (req, res) => {
  try {
    const { filter } = req.query;

    const now = new Date();

    let startDate = null;
    let endDate = null;

    if (filter === "this_month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    if (filter === "last_month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const query = {
      isPaidSessionMarked: true,
      paidAmount: { $exists: true },
    };

    if (startDate && endDate) {
      query.paidAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const appointments = await Appointment.find(query)
      .populate("user", "name email")
      .populate("availability", "date startHour");

    let totalRevenue = 0;
    let totalCommission = 0;
    let totalPaidSessions = appointments.length;

    appointments.forEach((appt) => {
      totalRevenue += appt.paidAmount || 0;
      totalCommission += appt.commissionAmount || 0;
    });

    res.json({
      totalRevenue,
      totalCommission,
      totalPaidSessions,
      paidAppointments: appointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Convert FREE appointment to PAID (admin) */

export const convertToPaidSession = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("user");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only allow it if it is free

    if (appointment.sessionType !== "free") {
      return res.status(400).json({
        message: "Only free sessions can be converted",
      });
    }

    const user = appointment.user;

    // Maximum 4 paid sessions

    if (user.paymentCount >= 4) {
      return res.status(400).json({
        message: "Maximum number of paid sessions reached",
      });
    }

    const nextPaymentNumber = user.paymentCount + 1;

    // Convert the appointment

    appointment.sessionType = `paid_${nextPaymentNumber}`;
    await appointment.save();

    // Update the user counter
    
    user.paymentCount += 1;
    await user.save();

    res.json({
      message: "Appointment converted to paid session",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};