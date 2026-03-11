import express from "express";
import { createAppointment, getMyAppointments, getAllAppointments } from "../controllers/appointment.controller.js";
import { protect } from "../../middleware/isAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import { updateAppointmentStatus } from "../controllers/appointment.controller.js";
import { cancelAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

/* User creates appointment */
router.post("/", protect, createAppointment);

/* User views HIS appointments */
router.get("/my", protect, getMyAppointments);

/* Admin sees ALL appointments */
router.get("/", protect, isAdmin, getAllAppointments);

/* Admin changes status */
router.patch("/:id", protect, isAdmin, updateAppointmentStatus);

/* User cancels HIS appointment */
router.delete("/:id", protect, cancelAppointment);

export default router;