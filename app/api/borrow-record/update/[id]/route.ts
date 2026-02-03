import { connectDB } from "@/lib/db";
import borrowRecordModel from "@/models/borrowRecord.model";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: any
) {
  try {
    await connectDB();

    const body = await req.json();

    const updatedRecord = await borrowRecordModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updatedRecord) {
      return NextResponse.json(
        { success: false, message: "Borrow record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Borrow record updated successfully",
      data: updatedRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}