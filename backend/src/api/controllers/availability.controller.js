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