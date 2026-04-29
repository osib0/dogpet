import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import { z } from "zod";

const patientSchema = z.object({
  owner_name: z.string().min(1, "Owner name is required"),
  pet_name: z.string().min(1, "Pet name is required"),
  type: z.enum(["PUP", "ADULT"]).optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  dob: z.string().optional(),
  phone: z.string().optional(),
  is_active: z.boolean().optional(),
  email: z.string().optional(),
  picture: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate the input
    const validatedData = patientSchema.parse(body);

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