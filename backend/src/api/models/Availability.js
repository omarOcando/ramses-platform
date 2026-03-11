import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startHour: {
      type: String,
      required: true,
    },
    endHour: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Availability", availabilitySchema);