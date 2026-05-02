import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import { z } from "zod";

const patientSchema = z.object({
  _id: z.string().nullable().optional(),
  owner_name: z.string().optional(),
  pet_name: z.string().optional(),
  pet_category: z.string().optional(),
  pet_type: z.string().optional(),
  type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.string().optional(),
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
    const { _id, ...data } = validatedData;

    let patient;
    if (_id) {
      patient = await Patient.findByIdAndUpdate(_id, data, { new: true });
    } else {
      patient = await Patient.create(data);
    }

    return NextResponse.json(patient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error saving patient:", error);
    return NextResponse.json(
      { error: "Failed to save patient" },
      { status: 500 }
    );
  }
}