import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    collaboration: { type: mongoose.Schema.Types.ObjectId, ref: "Collaboration", required: true, unique: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);