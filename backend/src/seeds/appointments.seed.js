import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../api/models/User.js";
import Availability from "../api/models/Availability.js";
import Appointment from "../api/models/Appointment.js";

dotenv.config();

const seedAppointments = async () => {
  await connectDB();

  try {
    await Appointment.deleteMany();

    const users = await User.find().limit(15);
    const availabilities = await Availability.find({ isBooked: false }).limit(15);

    const appointmentsToInsert = [];

    for (let i = 0; i < 15; i++) {
      appointmentsToInsert.push({
        user: users[i]._id,
        availability: availabilities[i]._id,
        status: "approved",
      });

      availabilities[i].isBooked = true;
      await availabilities[i].save();
    }

    await Appointment.insertMany(appointmentsToInsert);

    console.log("Appointments seeded successfully ✅");
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
};

seedAppointments();