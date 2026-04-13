import { Schema, models, model } from "mongoose";

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export default models.Role || model("Role", RoleSchema);
