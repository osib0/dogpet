import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import membersModel from "@/models/members.model";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: any) {
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

    const librarian_id = session.user.id;

    const member = await membersModel.findOne({
      _id: params.id,
      librarian_id,
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found or unauthorized" },
        { status: 404 }
      );
    }

    await membersModel.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
