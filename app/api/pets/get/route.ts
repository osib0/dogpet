import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pet from "@/models/pet.model";

export async function GET() {
  try {
    await connectDB();
    const pets = await Pet.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: pets });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
  }
}
