import { Schema, models, model } from "mongoose";

const ModuleSchema = new Schema(
  {
    page_name: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    description: String,
  },
  { timestamps: true }
);

export default models.Module || model("Module", ModuleSchema);
