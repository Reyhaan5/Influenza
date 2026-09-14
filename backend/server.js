import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import influencerRoutes from "./routes/influencerRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import collaborationRequestRoutes from "./routes/collaborationRequestRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import deliverableRoutes from "./routes/deliverableRoutes.js";
import { initSocket } from "./socket/index.js";

// Registering every model here ensures Mongoose knows about them before
// any .populate() call tries to reference them — even ones without full
// controllers/routes built yet.
import "./models/User.js";
import "./models/InfluencerProfile.js";
import "./models/Opportunity.js";
import "./models/CollaborationRequest.js";
import "./models/Collaboration.js";
import "./models/Deliverable.js";
import "./models/ContentPost.js";
import "./models/Review.js";
import "./models/Brand.js";
import "./models/Product.js";
import "./models/Conversation.js";
import "./models/Message.js";
import "./models/GalleryContent.js";

import path from "path";
import { fileURLToPath } from "url";
import { corsOptions } from "./config/cors.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config(); // fallback
connectDB(); // connect to MongoDB Atlas (see config/db.js)

const app = express();

// Trust reverse proxy (needed for Render / Heroku / Vercel to correctly identify client IP)
app.set("trust proxy", 1);

// ---------- Security Middleware ----------

// CORS — support dynamic Vercel preview URLs, localhost, and CLIENT_URL
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Global rate limiter — generous threshold for SPA navigation & multi-endpoint dashboards
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 1000 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many login attempts, please try again later." },
});

// Parse JSON bodies
app.use(express.json());

// Sanitize user input — prevents NoSQL injection via $gt, $ne, etc.
app.use(mongoSanitize());

// Serves uploaded product images statically (both /uploads and /api/uploads)
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads", express.static("uploads"));

// ---------- Routes ----------

// Auth routes with stricter rate limiting
app.use("/api/auth", authLimiter, authRoutes);
// Every URL starting with /api/influencer goes to influencerRoutes.js
app.use("/api/influencer", influencerRoutes);
app.use("/api/public", publicRoutes);
// Every URL starting with /api/brand goes to brandRoutes.js
app.use("/api/brand", brandRoutes);
// Every URL starting with /api/collaboration-requests goes to collaborationRequestRoutes.js
app.use("/api/collaboration-requests", collaborationRequestRoutes);
// Every URL starting with /api/messages goes to messageRoutes.js
app.use("/api/messages", messageRoutes);
// Deliverables workflow
app.use("/api/collaborations/:collabId/deliverables", deliverableRoutes);

// Simple health check — visit http://localhost:5000/ to confirm it's running
app.get("/", (req, res) => {
  res.send("Influenza API is running.");
});

// Wrap Express in a raw HTTP server so Socket.IO can attach to the same port
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
