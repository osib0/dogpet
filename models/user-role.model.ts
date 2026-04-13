import { Schema, models, model } from "mongoose";
import "./role.model"; // Ensure Role model is registered

const UserRoleSchema = new Schema(
  {
    user_id: { type: String, required: true },
    role_id: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export default models.UserRole || model("UserRole", UserRoleSchema);
