import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import influencerRoutes from "./routes/influencerRoutes.js";
import instagramRoutes from "./routes/instagramRoutes.js";

// Register models
import "./models/User.js";
import "./models/InfluencerProfile.js";
import "./models/Opportunity.js";
import "./models/CollaborationRequest.js";
import "./models/Collaboration.js";
import "./models/ContentPost.js";
import "./models/Review.js";

const result = dotenv.config();

console.log(result);
console.log("TOKEN IN SERVER:", process.env.APIFY_TOKEN);
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/influencer", influencerRoutes);
app.use("/api/instagram", instagramRoutes);

app.get("/", (req, res) => {
  res.send("Influenza API is running.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});