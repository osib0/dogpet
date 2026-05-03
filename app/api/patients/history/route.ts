import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MedicalRecord from "@/models/medical-record.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const history = await MedicalRecord.find({ phone }).sort({ date: -1 });
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
    const { patient_id, phone, type, item_name, disease, disease_type, description, date } = body;

    if (!phone || !type || !item_name) {
      return NextResponse.json(
        { error: "Phone, type, and item name are required" },
        { status: 400 }
      );
    }

    const newRecord = await MedicalRecord.create({
      patient_id,
      phone,
      type,
      item_name,
      disease,
      disease_type,
      description,
      date: date || new Date(),
    });

    return NextResponse.json({ success: true, data: newRecord });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 });
  }
}
