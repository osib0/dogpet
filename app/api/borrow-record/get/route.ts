import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import borrowRecordModel from "@/models/borrowRecord.model";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
  try {
    await connectDB();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const librarianId = session.user.id;
    const records = await borrowRecordModel
      .find({librarian_id: librarianId})
      .populate({
        path: "member_id",
        select: "fullName email enrollmentId phone",
      })
      .populate({
        path: "book_id",
        select: "title author isbn",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "Borrow records retrieved successfully",
      data: records,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Server error" },
      { status: 400 }
    );
  }
}
