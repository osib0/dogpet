import { connectDB } from "@/lib/db";
import borrowRecordModel from "@/models/borrowRecord.model";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    const deletedRecord = await borrowRecordModel.findByIdAndDelete(params.id);

    if (!deletedRecord) {
      return NextResponse.json(
        { success: false, message: "Borrow record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Borrow record deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
