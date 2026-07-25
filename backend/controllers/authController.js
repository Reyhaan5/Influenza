import jwt from "jsonwebtoken";
import User from "../models/User.js";
import InfluencerProfile from "../models/InfluencerProfile.js";

// A JWT (JSON Web Token) is like a signed, tamper-proof ID badge.
// After login, the frontend stores this token and sends it on every
// future request so the backend knows "this is user X, already logged in."
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// POST /api/auth/register
// "req" = what the frontend sent us. "res" = how we reply.
// Every route handler that touches the database is "async" because
// database calls happen over the network and take time to come back.
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Password gets hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, email, password, role });

    // If they're signing up as an influencer, create their empty profile now
    // so the dashboard has something to load immediately.
    if (role === "influencer") {
      await InfluencerProfile.create({
        user: user._id,
        handle: `@${name.toLowerCase().replace(/\s+/g, "_")}`,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether it was the email or password that was wrong —
      // that's a small security best-practice.
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/auth/me  (protected — used to check "am I still logged in?")
export const getMe = async (req, res) => {
  // req.user is attached by authMiddleware.js before this ever runs
  res.json(req.user);
};
