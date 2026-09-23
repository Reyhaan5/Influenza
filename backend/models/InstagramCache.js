import mongoose from "mongoose";

const instagramCacheSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      default: "",
    },
    profilePicUrl: {
      type: String,
      default: "",
    },
    rawProfilePicUrl: {
      type: String,
      default: "",
    },
    biography: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: Number,
      default: 0,
    },
    avgLikes: {
      type: Number,
      default: 0,
    },
    avgComments: {
      type: Number,
      default: 0,
    },
    avgViews: {
      type: Number,
      default: 0,
    },
    topPosts: [
      {
        id: String,
        caption: String,
        likes: Number,
        comments: Number,
        views: Number,
        url: String,
        displayUrl: String,
        isVideo: Boolean,
      },
    ],
    lastFetchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("InstagramCache", instagramCacheSchema);
