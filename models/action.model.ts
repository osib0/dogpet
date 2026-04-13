import { Schema, models, model } from "mongoose";

const ActionSchema = new Schema(
  {
    name: { type: String, required: true },
    module_id: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    description: String,
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export default models.Action || model("Action", ActionSchema);
