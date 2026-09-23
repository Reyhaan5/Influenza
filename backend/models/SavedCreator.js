import mongoose from "mongoose";

const savedCreatorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InfluencerProfile",
      required: true,
    },
    listName: {
      type: String,
      default: "Favorites",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

savedCreatorSchema.index({ user: 1, creator: 1 }, { unique: true });

export default mongoose.model("SavedCreator", savedCreatorSchema);
