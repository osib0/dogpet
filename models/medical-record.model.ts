import { Schema, models, model } from "mongoose";

const MedicalRecordSchema = new Schema(
  {
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient" },
    // NEW: specific pet within the owner's pets array
    pet_id: { type: Schema.Types.ObjectId },
    phone: { type: String, required: true },
    type: { type: String, enum: ["VACCINATION", "TEST", "MEDICATION"], required: true },
    item_name: { type: String, required: true },
    disease: String,
    disease_type: String,
    description: String,
    date: { type: Schema.Types.Mixed },
    visit_date: { type: Schema.Types.Mixed },
    next_visit_date: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default models.MedicalRecord || model("MedicalRecord", MedicalRecordSchema);
