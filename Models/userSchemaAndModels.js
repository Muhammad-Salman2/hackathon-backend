import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "visitor","user"], required: true },
  },
  {
    
    timestamps: true,
  }
);

const userModel =
  mongoose.models.userInfo || mongoose.model("userinfo", userSchema);
export default userModel;
