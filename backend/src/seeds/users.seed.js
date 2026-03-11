import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import User from "../api/models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = [];

const seedUsers = async () => {
  await connectDB();

  const filePath = path.join(__dirname, "../data/users.csv");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        await User.deleteMany();

        const usersToInsert = [];

        for (const user of results) {
          const hashedPassword = await bcrypt.hash(user.password, 10);

          usersToInsert.push({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role: user.role,
          });
        }

        await User.insertMany(usersToInsert);

        console.log("Users seeded successfully ✅");
        mongoose.connection.close();
      } catch (error) {
        console.error(error);
        mongoose.connection.close();
      }
    });
};

seedUsers();