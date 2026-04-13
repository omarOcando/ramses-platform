import express from "express";
import {
  createAvailability,
  createAvailabilityRange,
  getAllAvailability,
  getAvailableSlots,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availability.controller.js";
import { protect } from "../../middleware/isAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

/* Admin creates slot */
router.post("/", protect, isAdmin, createAvailability);

/* Admin creates multiple 1-hour slots */
router.post("/range", protect, isAdmin, createAvailabilityRange);

/* Admin sees all slots */
router.get("/", protect, isAdmin, getAllAvailability);

/* Users only see available */
router.get("/available", protect, getAvailableSlots);

/* Admin updates slot */
router.put("/:id", protect, isAdmin, updateAvailability);

/* Admin deletes slot */
router.delete("/:id", protect, isAdmin, deleteAvailability);

export default router;