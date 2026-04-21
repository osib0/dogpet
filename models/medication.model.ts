import { Schema, models, model } from "mongoose";

const MedicationSchema = new Schema(
  {
    disease: { type: String, required: true },
    disease_type: { type: String, required: true },
    medicine_name: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

export default models.Medication || model("Medication", MedicationSchema);
