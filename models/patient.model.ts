import { Schema, models, model } from "mongoose";

const PatientSchema = new Schema(
  {
    owner_name: { type: String, required: true },
    pet_name: { type: String, required: true },
    type: { type: String, enum: ["PUP", "ADULT"] },
    breed: String,
    color: String,
    sex: { type: String, enum: ["MALE", "FEMALE"] },
    dob: String,
    phone: String,
    is_active: { type: Boolean, default: true },
    email: String,
    picture: String,
  },
  { timestamps: true }
);

export default models.Patient || model("Patient", PatientSchema);