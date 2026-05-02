import { NextResponse } from "next/server";
import Patient from "@/models/patient.model";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const patient = await Patient.findById(id);
      if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const total = await Patient.countDocuments();
    const patients = await Patient.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}