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
    vaccine: String, // Keeping this for backwards compatibility, maybe it's used elsewhere
    visit_date: Date,
    next_visit_note: String, // Keeping this as well
    type: String,
    color: String,
    address: String,
    dob: Date,
    current_complaint: String,
    batch_no: String,
    send_sms_vaccination: { type: Boolean, default: false },
    send_sms_vaccination_type: { type: Boolean, default: false },
    medications: [{ 
      disease: String, 
      disease_type: String, 
      medicine: String 
    }],
    diagnosis: String,
    duration: String,
    due_date: Date,
    email: String,
    remarks: String,
  },
  { timestamps: true }
);

export default models.Patient || model("Patient", PatientSchema);