import { Schema, models, model } from "mongoose";

const PermissionSchema = new Schema(
  {
    role_id: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    module_id: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    action_ids: [{ type: Schema.Types.ObjectId, ref: "Action" }],
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export default models.Permission || model("Permission", PermissionSchema);
