import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import influencerRoutes from "./routes/influencerRoutes.js";

// Registering every model here ensures Mongoose knows about them before
// any .populate() call tries to reference them — even ones without full
// controllers/routes built yet.
import "./models/User.js";
import "./models/InfluencerProfile.js";
import "./models/Opportunity.js";
import "./models/CollaborationRequest.js";
import "./models/Collaboration.js";
import "./models/ContentPost.js";
import "./models/Review.js";

dotenv.config(); // loads variables from .env into process.env

connectDB(); // connect to MongoDB Atlas (see config/db.js)

const app = express();

// Lets your React app (running on localhost:5173) call this server
// (running on localhost:5000) without the browser blocking it.
app.use(cors());

// Lets Express understand JSON bodies sent from axios/fetch,
// e.g. req.body.email in your controllers.
app.use(express.json());

// Every URL starting with /api/auth goes to authRoutes.js
app.use("/api/auth", authRoutes);

// Every URL starting with /api/influencer goes to influencerRoutes.js
app.use("/api/influencer", influencerRoutes);

// Simple health check — visit http://localhost:5000/ to confirm it's running
app.get("/", (req, res) => {
  res.send("Influenza API is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});