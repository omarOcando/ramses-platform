import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Availability from "../api/models/Availability.js";
import connectDB from "../config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = [];

const seedAvailability = async () => {
  await connectDB();

  const filePath = path.join(__dirname, "../data/availability.csv");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push({
        date: new Date(data.date),
        startHour: data.startHour,
        endHour: data.endHour,
        isBooked: data.isBooked === "true",
      });
    })
    .on("end", async () => {
      try {
        await Availability.deleteMany();
        await Availability.insertMany(results);
        console.log("Availability seeded successfully ✅");
        mongoose.connection.close();
      } catch (error) {
        console.error(error);
        mongoose.connection.close();
      }
    });
};

seedAvailability();