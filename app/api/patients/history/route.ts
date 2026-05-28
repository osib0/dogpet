import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MedicalRecord from "@/models/medical-record.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const patient_id = searchParams.get("patient_id");
    const pet_id = searchParams.get("pet_id");
    const phone = searchParams.get("phone");

    if (!phone && !patient_id) {
      return NextResponse.json({ error: "Phone or Patient ID is required" }, { status: 400 });
    }

    let query: Record<string, unknown> = {};

    if (pet_id) {
      // Fetch history for a specific pet — most precise filter
      query = { pet_id };
    } else if (patient_id) {
      // Fetch all history for an owner (legacy / fallback)
      query = {
        $or: [
          { patient_id },
          { phone, patient_id: { $exists: false } },
        ],
      };
    } else {
      query = { phone };
    }

    const history = await MedicalRecord.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      patient_id,
      pet_id, // NEW — specific pet
      phone,
      type,
      item_name,
      disease,
      disease_type,
      description,
      date,
      visit_date,
      next_visit_date,
    } = body;

    if (!phone || !type || !item_name) {
      return NextResponse.json(
        { error: "Phone, type, and item name are required" },
        { status: 400 }
      );
    }

    const newRecord = await MedicalRecord.create({
      patient_id,
      pet_id: pet_id || undefined,
      phone,
      type,
      item_name,
      disease,
      disease_type,
      description,
      date: date || new Date(),
      visit_date: visit_date || new Date(),
      next_visit_date: next_visit_date || null,
    });

    return NextResponse.json({ success: true, data: newRecord });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const record_id = searchParams.get("record_id");

    if (!record_id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    await MedicalRecord.findByIdAndDelete(record_id);
    return NextResponse.json({ success: true, message: "Record deleted" });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
