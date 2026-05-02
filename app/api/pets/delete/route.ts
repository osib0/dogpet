import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pet from "@/models/pet.model";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
    }

    await Pet.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 });
  }
}
