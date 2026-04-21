import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import { z } from "zod";

const patientSchema = z.object({
  pet_id: z.string().optional(),
  owner_name: z.string().min(1, "Owner name is required"),
  phone: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  age: z.string().optional(),
  pet_name: z.string().min(1, "Pet name is required"),
  breed: z.string().optional(),
  vaccine: z.string().optional(),
  visit_date: z.string().optional(),
  next_visit_note: z.string().optional(),
  type: z.string().optional(),
  color: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
  current_complaint: z.string().optional(),
  batch_no: z.string().optional(),
  send_sms_vaccination: z.boolean().optional(),
  send_sms_vaccination_type: z.boolean().optional(),
  medications: z.array(z.object({
    disease: z.string().optional(),
    disease_type: z.string().optional(),
    medicine: z.string().optional(),
  })).optional(),
  diagnosis: z.string().optional(),
  duration: z.string().optional(),
  due_date: z.string().optional(),
  email: z.string().optional(),
  remarks: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate the input
    const validatedData = patientSchema.parse(body);

    // Convert visit_date to Date if provided
    if (validatedData.visit_date) {
      (validatedData as any).visit_date = new Date(validatedData.visit_date);
    }

    const patient = await Patient.create(validatedData);

    return NextResponse.json(patient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}