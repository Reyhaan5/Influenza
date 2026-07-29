import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema(
  {
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    initiatedBy: { type: String, enum: ["influencer", "brand"], required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("CollaborationRequest", collaborationRequestSchema);