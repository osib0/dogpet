import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    auth_id: { type: String, sparse: true }, // ID from auth system - sparse allows multiple null values
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
