import Availability from "../models/Availability.js";

/* Admin creates available slot */

export const createAvailability = async (req, res) => {
  try {
    const availability = await Availability.create(req.body);
    res.status(201).json(availability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Admin creates multiple 1-hour slots */

export const createAvailabilityRange = async (req, res) => {
  try {
    const { date, startHour, endHour } = req.body;

    if (!date || !startHour || !endHour) {
      return res.status(400).json({
        message: "date, startHour and endHour are required",
      });
    }

    const [startH, startM] = startHour.split(":").map(Number);
    const [endH, endM] = endHour.split(":").map(Number);

    const start = new Date(date);
    start.setHours(startH, startM, 0, 0);

    const end = new Date(date);
    end.setHours(endH, endM, 0, 0);

    if (start >= end) {
      return res.status(400).json({
        message: "End hour must be later than start hour",
      });
    }

    const slotsToCreate = [];
    let current = new Date(start);

    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current);
      slotEnd.setHours(slotEnd.getHours() + 1);

      if (slotEnd > end) break;

      const formattedStart = `${String(slotStart.getHours()).padStart(
        2,
        "0"
      )}:${String(slotStart.getMinutes()).padStart(2, "0")}`;
      const formattedEnd = `${String(slotEnd.getHours()).padStart(
        2,
        "0"
      )}:${String(slotEnd.getMinutes()).padStart(2, "0")}`;

      const existingSlot = await Availability.findOne({
        date,
        startHour: formattedStart,
        endHour: formattedEnd,
      });

      if (!existingSlot) {
        slotsToCreate.push({
          date,
          startHour: formattedStart,
          endHour: formattedEnd,
        });
      }

      current.setHours(current.getHours() + 1);
    }

    if (slotsToCreate.length === 0) {
      return res.status(400).json({
        message: "All slots in this range already exist",
      });
    }

    const createdSlots = await Availability.insertMany(slotsToCreate);

    res.status(201).json(createdSlots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* View all slots */

export const getAllAvailability = async (req, res) => {
  try {
    const availability = await Availability.find();
    res.json(availability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* View only available slots */

export const getAvailableSlots = async (req, res) => {
  try {
    const availability = await Availability.find({ isBooked: false });
    res.json(availability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Admin updates slot */

export const updateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const updatedAvailability = await Availability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAvailability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Admin deletes slot */

export const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (availability.isBooked) {
      return res.status(400).json({
        message: "Booked slots cannot be deleted",
      });
    }

    await availability.deleteOne();

    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
