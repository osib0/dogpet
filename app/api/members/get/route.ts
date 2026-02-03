import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import membersModel from "@/models/members.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    const members = await membersModel
      .find({ librarian_id: librarianId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "Members retrieved successfully",
      data: members,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
