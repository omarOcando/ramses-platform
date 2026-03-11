import express from "express";
import { createAvailability, getAllAvailability, getAvailableSlots } from "../controllers/availability.controller.js";
import { protect } from "../../middleware/isAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

/* Admin creates slot */
router.post("/", protect, isAdmin, createAvailability);

/* Admin sees all slots */
router.get("/", protect, isAdmin, getAllAvailability);

/* Users only see available */
router.get("/available", protect, getAvailableSlots);

export default router;