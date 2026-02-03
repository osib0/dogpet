import { connectDB } from "@/lib/db";
import borrowRecordModel from "@/models/borrowRecord.model";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  try {
    await connectDB();

    const record = await borrowRecordModel
      .findById(params.id)
      .populate("member_id")
      .populate("book_id");

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Borrow record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Borrow record retrieved successfully",
      data: record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
