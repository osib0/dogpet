import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import MedicalRecord from "@/models/medical-record.model";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const pet_id = searchParams.get("pet_id");

    if (!id) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
    }

    // ── Delete a specific pet from owner ───────────────────────────────────
    if (pet_id) {
      // Also delete this pet's medical records
      await MedicalRecord.deleteMany({ patient_id: id, pet_id });

      const updated = await Patient.findByIdAndUpdate(
        id,
        { $pull: { pets: { _id: pet_id } } },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "Pet deleted successfully",
        patient: updated,
      });
    }

    // ── Delete entire owner (+ all their pets + all medical records) ───────
    await MedicalRecord.deleteMany({ patient_id: id });
    await Patient.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
