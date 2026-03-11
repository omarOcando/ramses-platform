import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import calendar from "../../utils/googleCalendar.js";
import { sendApprovalEmail, sendCancellationEmail, notifyAdminNewBooking } from "../../utils/email.js";

/* Create appointment (logged in user) */

export const createAppointment = async (req, res) => {
  try {
    const { availabilityId } = req.body;

    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (availability.isBooked) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      availability: availability._id,
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
      .populate("user", "email");

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
      const startHour = parseInt(availability.startHour.split(":")[0]);
      const endHour = parseInt(availability.endHour.split(":")[0]);

      const startDateTime = new Date(startDate);
      startDateTime.setHours(startHour, 0, 0, 0);

      const endDateTime = new Date(startDate);
      endDateTime.setHours(endHour, 0, 0, 0);

      const googleEvent = await calendar.events.insert({
        calendarId: "ramses.beziehungscoach@gmail.com",
        requestBody: {
          summary: "Relationship Coaching Session",
          description: `Session with ${appointment.user.email}`,
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

    const appointment = await Appointment.findById(req.params.id)
      .populate("availability");

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