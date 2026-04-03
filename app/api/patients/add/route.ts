import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import { z } from "zod";

const patientSchema = z.object({
  pet_id: z.string().min(1, "Pet ID is required"),
  owner_name: z.string().min(1, "Owner name is required"),
  phone: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  age: z.string().optional(),
  pet_name: z.string().min(1, "Pet name is required"),
  breed: z.string().optional(),
  vaccine: z.string().optional(),
  visit_date: z.string().optional(),
  next_visit_note: z.string().optional(),
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