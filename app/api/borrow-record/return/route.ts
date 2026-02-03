import { connectDB } from "@/lib/db";
import borrowRecordModel from "@/models/borrowRecord.model";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { borrowId } = await req.json();

    if (!borrowId) {
      return NextResponse.json(
        { success: false, message: "Borrow ID is required" },
        { status: 400 }
      );
    }

    const record = await borrowRecordModel.findById(borrowId);

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }


    if (record.status === "returned") {
      return NextResponse.json({
        success: true,
        message: "Book already returned",
        data: record,
      });
    }

    // auto overdue detection
    const now = new Date();
    const isLate =
      record.return_date &&
      new Date(record.return_date).getTime() < now.getTime();

    record.status = "returned";
    record.return_date = now;

    await record.save();

    return NextResponse.json({
      success: true,
      message: isLate ? "Book returned (Late)" : "Book returned",
      data: record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 400 }
    );
  }
}
