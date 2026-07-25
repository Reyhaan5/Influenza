import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// A "schema" is just a blueprint: what fields does every User document have?
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true, // MongoDB will reject a second signup with the same email
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true }, // stored HASHED, never plain text
    role: {
      type: String,
      enum: ["influencer", "brand"], // only these two values are allowed
      required: true,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// This runs automatically right BEFORE a user is saved to the database.
// "pre-save hook". We intercept the plain password and hash it here,
// so the raw password is never written to MongoDB.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password unchanged
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: lets us call user.comparePassword("typed-password")
// during login, instead of writing this logic in every controller.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
