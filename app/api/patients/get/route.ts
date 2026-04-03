import { NextResponse } from "next/server";
import Patient from "@/models/patient.model";

export async function GET() {
  try {
    const patients = await Patient.find({})
      .sort({ dateOfVisit: -1 })
      .lean();

    return NextResponse.json({ patients });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}