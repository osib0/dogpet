import { Schema, models, model } from "mongoose";

const PetSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    types: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.Pet || model("Pet", PetSchema);
