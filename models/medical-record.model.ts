import { Schema, models, model } from "mongoose";

const MedicalRecordSchema = new Schema(
  {
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient" },
    phone: { type: String, required: true },
    type: { type: String, enum: ["VACCINATION", "TEST", "MEDICATION"], required: true },
    item_name: { type: String, required: true },
    disease: String,
    disease_type: String,
    description: String,
    date: { type: Date, default: Date.now },
    visit_date: { type: Date, default: Date.now },
    next_visit_date: { type: Date },
  },
  { timestamps: true }
);

export default models.MedicalRecord || model("MedicalRecord", MedicalRecordSchema);
