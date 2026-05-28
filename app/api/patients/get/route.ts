import { NextResponse } from "next/server";
import Patient from "@/models/patient.model";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    // ── Fetch single owner by ID ──────────────────────────────────────────
    if (id) {
      const patient = await Patient.findById(id);
      if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    // ── Fetch owner by phone (for duplicate check on add-pet flow) ────────
    if (phone) {
      const patient = await Patient.findOne({ phone });
      if (!patient) {
        return NextResponse.json({ found: false });
      }
      return NextResponse.json({ found: true, patient });
    }

    // ── Paginated owner list ──────────────────────────────────────────────
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let query: Record<string, unknown> = {};
    if (search) {
      query = {
        $or: [
          { owner_name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          // Search inside embedded pets array
          { "pets.pet_name": { $regex: search, $options: "i" } },
          { "pets.pet_category": { $regex: search, $options: "i" } },
          { "pets.pet_type": { $regex: search, $options: "i" } },
          { "pets.breed": { $regex: search, $options: "i" } },
          // Legacy flat fields for old records
          { pet_name: { $regex: search, $options: "i" } },
          { breed: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      patients,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}