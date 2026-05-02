import { Schema, models, model } from "mongoose";

const PatientSchema = new Schema(
  {
    owner_name: { type: String, },
    pet_name: { type: String, },
    pet_category: { type: String },
    pet_type: { type: String },
    type: { type: String },
    breed: String,
    color: String,
    sex: { type: String },
    dob: String,
    phone: String,
    is_active: { type: Boolean, default: true },
    email: String,
    picture: String,
  },
  { timestamps: true }
);

export default models.Patient || model("Patient", PatientSchema);