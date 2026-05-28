import { Schema, models, model } from "mongoose";

// Embedded pet schema — each owner can have multiple pets
const PetEmbeddedSchema = new Schema(
  {
    pet_name: { type: String },
    pet_category: { type: String },
    pet_type: { type: String },
    breed: { type: String },
    color: { type: String },
    sex: { type: String },
    dob: { type: String },
    picture: { type: String, default: "" },
    is_active: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true } // each pet gets its own _id + timestamps
);

// Owner-level schema — phone is the unique owner identifier
const PatientSchema = new Schema(
  {
    owner_name: { type: String },
    phone: { type: String, index: true }, // unique owner identifier
    email: { type: String, default: "" },
    is_active: { type: Boolean, default: true },
    // Embedded pets array — multiple pets per owner
    pets: { type: [PetEmbeddedSchema], default: [] },
    // Legacy flat fields kept for backward compat with old records
    pet_name: { type: String },
    pet_category: { type: String },
    pet_type: { type: String },
    breed: { type: String },
    color: { type: String },
    sex: { type: String },
    dob: { type: String },
    picture: { type: String },
    select_date: { type: String },
    visit_date: { type: String },
    next_visit_date: { type: String },
  },
  { timestamps: true }
);

export default models.Patient || model("Patient", PatientSchema);