import { Schema, models, model } from "mongoose";

const PatientSchema = new Schema(
  {
    pet_id: { type: String, required: true },
    owner_name: { type: String, required: true },
    phone: String,
    sex: { type: String, enum: ["MALE", "FEMALE"] },
    age: String,
    pet_name: { type: String, required: true },
    breed: String,
    vaccine: String,
    visit_date: Date,
    next_visit_note: String,
  },
  { timestamps: true }
);

export default models.Patient || model("Patient", PatientSchema);