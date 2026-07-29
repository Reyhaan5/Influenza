import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "CollaborationRequest", required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    format: { type: String, enum: ["money", "barter", "product"], required: true },
    deliverablesTotal: { type: Number, default: 1 },
    deliverablesCompleted: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    stage: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
  },
  { timestamps: true }
);

export default mongoose.model("Collaboration", collaborationSchema);