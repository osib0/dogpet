import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const patient = await Patient.create(body);

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}