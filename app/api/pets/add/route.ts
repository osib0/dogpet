import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pet from "@/models/pet.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, types } = body;

    if (!name) {
      return NextResponse.json({ error: "Pet name is required" }, { status: 400 });
    }

    if (id) {
      // Update existing
      const updatedPet = await Pet.findByIdAndUpdate(
        id,
        { name, types },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updatedPet });
    } else {
      // Create new
      const pet = await Pet.create({ name, types });
      return NextResponse.json({ success: true, data: pet });
    }
  } catch (error) {
    console.error("Error saving pet:", error);
    return NextResponse.json({ error: "Failed to save pet" }, { status: 500 });
  }
}
