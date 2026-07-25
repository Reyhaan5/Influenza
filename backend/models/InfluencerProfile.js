import mongoose from "mongoose";

// This maps directly to what InfluencerDashboard.jsx renders:
// ProfileCard, StatCard x3, ChallengeCard list, TrophyList.
const challengeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    note: String,
    progress: { type: Number, default: 0 },
    total: { type: Number, default: 1 },
    bonus: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
  },
  { _id: false } // these are simple sub-items, they don't need their own IDs
);

const influencerProfileSchema = new mongoose.Schema(
  {
    // Links this profile back to the User who owns it (the login account).
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    handle: { type: String, required: true },
    posts: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    approved: { type: Boolean, default: false },

    stats: {
      collaborationsCompleted: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      reviewsCount: { type: Number, default: 0 },
      trophiesCount: { type: Number, default: 0 },
      trophiesTotal: { type: Number, default: 5 },
    },

    challenges: [challengeSchema],
    trophies: [String], // e.g. ["Top content", "Most liked"]
  },
  { timestamps: true }
);

const InfluencerProfile = mongoose.model(
  "InfluencerProfile",
  influencerProfileSchema
);
export default InfluencerProfile;
