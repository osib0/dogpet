import { Schema, models, model } from "mongoose";

const PatientSchema = new Schema(
  {
    ownerName: { type: String, required: true },
    petName: { type: String, required: true },

    type: String,
    breed: String,
    color: String,

    gender: { type: String, enum: ["male", "female"] },
    age: String,
    mobile: String,
    address: String,

    dateOfBirth: Date,
    dateOfVisit: Date,

    complaint: String,
    batchNo: String,

    sendSms: { type: String, enum: ["vaccination", "vaccinationType"] },

    vaccination: String,
    vaccinationType: String,

    disease: String,
    diseaseType: String,
    medication: String,

    diagnosis: String,

    duration: String,
    dueDate: Date,

    email: String,
    remarks: String,
  },
  { timestamps: true }
);

export default models.Patient || model("Patient", PatientSchema);