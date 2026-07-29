import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema(
  {opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }, // null if brand direct-invites without a posted listing
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    initiatedBy: { type: String, enum: ["influencer", "brand"], required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: Date, // set when influencer accepts/rejects — used for response-time challenge
  },
  { timestamps: true }
);

export default mongoose.model("CollaborationRequest", collaborationRequestSchema);