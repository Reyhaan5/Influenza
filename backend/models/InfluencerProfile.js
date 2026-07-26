import mongoose from "mongoose";

// Stores milestone progress for the influencer.
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
  { _id: false }
);

const influencerProfileSchema = new mongoose.Schema(
  {
    // Connected user account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // =========================
    // Basic Information
    // =========================
    fullName: {
      type: String,
      default: "",
    },

    handle: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    languages: {
      type: [String],
      default: [],
    },

    gender: {
      type: String,
      default: "",
    },

    // =========================
    // Social Accounts
    // =========================
    instagramUsername: {
      type: String,
      default: "",
    },

    youtubeChannel: {
      type: String,
      default: "",
    },

    tiktokUsername: {
      type: String,
      default: "",
    },

    facebookUsername: {
      type: String,
      default: "",
    },

    twitterUsername: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    // =========================
    // Social Statistics
    // =========================
    posts: {
      type: Number,
      default: 0,
    },

    followers: {
      type: Number,
      default: 0,
    },

    following: {
      type: Number,
      default: 0,
    },

    engagementRate: {
      type: Number,
      default: 0,
    },

    averageLikes: {
      type: Number,
      default: 0,
    },

    averageComments: {
      type: Number,
      default: 0,
    },

    averageViews: {
      type: Number,
      default: 0,
    },

    averageReach: {
      type: Number,
      default: 0,
    },

    // =========================
    // Pricing
    // =========================
    reelPrice: {
      type: Number,
      default: 0,
    },

    storyPrice: {
      type: Number,
      default: 0,
    },

    postPrice: {
      type: Number,
      default: 0,
    },

    ugcPrice: {
      type: Number,
      default: 0,
    },

    // =========================
    // Verification
    // =========================
    approved: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    socialAccountsConnected: {
      type: Boolean,
      default: false,
    },

    // =========================
    // Dashboard Statistics
    // =========================
    stats: {
      collaborationsCompleted: {
        type: Number,
        default: 0,
      },

      rating: {
        type: Number,
        default: 0,
      },

      reviewsCount: {
        type: Number,
        default: 0,
      },

      trophiesCount: {
        type: Number,
        default: 0,
      },

      trophiesTotal: {
        type: Number,
        default: 5,
      },
    },

    // =========================
    // Challenges & Achievements
    // =========================
    challenges: [challengeSchema],

    trophies: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const InfluencerProfile = mongoose.model(
  "InfluencerProfile",
  influencerProfileSchema
);

export default InfluencerProfile;