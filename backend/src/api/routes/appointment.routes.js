import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  markAttendance,
  markPaidSession,
  getRevenueStats,
  convertToPaidSession,
} from "../controllers/appointment.controller.js";
import { protect } from "../../middleware/isAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

/* User creates appointment */
router.post("/", protect, createAppointment);

/* User views HIS appointments */
router.get("/my", protect, getMyAppointments);

/* Admin sees ALL appointments */
router.get("/", protect, isAdmin, getAllAppointments);

/* Admin gets revenue stats */
router.get("/revenue", protect, isAdmin, getRevenueStats);

/* Admin changes status */
router.patch("/:id", protect, isAdmin, updateAppointmentStatus);

/* Admin marks attendance */
router.patch("/:id/attendance", protect, isAdmin, markAttendance);

/* User cancels HIS appointment */
router.delete("/:id", protect, cancelAppointment);

/* Admin marks paid session */
router.patch("/:id/payment", protect, isAdmin, markPaidSession);

/* Admin converts session from free into paid */
router.patch("/:id/convert-to-paid", protect, isAdmin, convertToPaidSession);

export default router;