import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "CollaborationRequest", required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    format: { type: String, enum: ["money", "barter", "product"], required: true },
    deliverablesTotal: { type: Number, default: 1 },
    deliverablesCompleted: { type: Number, default: 0 }, // incremented when a ContentPost is added
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" }, // manually toggled by brand for now
    stage: {
      type: String,
      enum: [
        "application",
        "content_creation",
        "review",
        "in_review",
        "posting",
        "ready_to_post",
        "completed",
        "in_progress",
      ],
      default: "content_creation",
    },
    brandEntity: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    notes: { type: String, default: "" },
    deadline: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Collaboration", collaborationSchema);