import express from "express";
import { registerUser, loginUser, getMe, updatePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// These become, once mounted at /api/auth in server.js:
// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/me
// PUT  /api/auth/update-password
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe); // "protect" runs first, blocks if not logged in
router.put("/update-password", protect, updatePassword);

export default router;
