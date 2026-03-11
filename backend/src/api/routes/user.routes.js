import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { protect } from "../../middleware/isAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});
router.get("/admin-only", protect, isAdmin, (req, res) => {
    res.json({ message: "Welcome admin" });
});

export default router;