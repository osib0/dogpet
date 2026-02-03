import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import membersModel from "@/models/members.model";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
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
    const body = await req.json();

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

    const updatedMember = await membersModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
