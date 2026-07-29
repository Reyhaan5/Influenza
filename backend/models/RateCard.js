// backend/models/RateCard.js
import mongoose from "mongoose";

const rateCardSchema = new mongoose.Schema(
  {
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followers: Number,
    avgLikes: Number,
    avgComments: Number,
    nicheId: String,
    marketId: String,
    rates: {
      post: Number,
      reel: Number,
      story: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RateCard", rateCardSchema);