import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    organizationUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: "Member",
    },
    access: {
      type: String,
      enum: ["Full Access", "Campaign Manager", "Reviewer", "Viewer"],
      default: "Full Access",
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "invited"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);
