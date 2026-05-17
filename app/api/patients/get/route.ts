import { NextResponse } from "next/server";
import Patient from "@/models/patient.model";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    if (id) {
      const patient = await Patient.findById(id);
      if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    if (phone) {
      const patient = await Patient.findOne({ phone });
      if (!patient) {
        return NextResponse.json({ found: false });
      }
      return NextResponse.json({ found: true, patient });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { owner_name: { $regex: search, $options: "i" } },
          { pet_name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { breed: { $regex: search, $options: "i" } },
          { pet_category: { $regex: search, $options: "i" } },
          { pet_type: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

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