import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // reason for the if statement above=>
  // Mongoose tracks which fields are modified on a document.
  // When creating a user, `password` is considered modified → so it gets hashed.
  // When updating other fields (e.g., username/email), `password` is NOT modified,
  // so we skip hashing to avoid hashing an already-hashed password again.
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (cadidatePassword) {
  return await bcrypt.compare(cadidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
