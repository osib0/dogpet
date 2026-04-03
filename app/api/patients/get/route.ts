import { NextResponse } from "next/server";
import Patient from "@/models/patient.model";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const patients = await Patient.find({}).sort({ createdAt: -1 })

    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}