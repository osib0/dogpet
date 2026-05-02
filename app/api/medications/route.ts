import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Medication from "@/models/medication.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { disease, disease_type, medicine_name, description } = body;

    if (!disease || !disease_type || !medicine_name) {
      return NextResponse.json(
        { error: "Disease, Disease Type, and Medicine Name are required" },
        { status: 400 }
      );
    }

    const medication = await Medication.create({
      disease,
      disease_type,
      medicine_name,
      description,
    });

    return NextResponse.json({ success: true, data: medication });
  } catch (error) {
    console.error("Error creating medication:", error);
    return NextResponse.json({ error: "Failed to create medication" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const medications = await Medication.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: medications });
  } catch (error) {
    console.error("Error fetching medications:", error);
    return NextResponse.json({ error: "Failed to fetch medications" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, disease, disease_type, medicine_name, description } = body;

    if (!id) {
      return NextResponse.json({ error: "Medication ID is required" }, { status: 400 });
    }

    const updatedMedication = await Medication.findByIdAndUpdate(
      id,
      { disease, disease_type, medicine_name, description },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedMedication });
  } catch (error) {
    console.error("Error updating medication:", error);
    return NextResponse.json({ error: "Failed to update medication" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Medication ID is required" }, { status: 400 });
    }

    await Medication.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Medication deleted successfully" });
  } catch (error) {
    console.error("Error deleting medication:", error);
    return NextResponse.json({ error: "Failed to delete medication" }, { status: 500 });
  }
}
