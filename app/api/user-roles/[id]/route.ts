import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import userRoleModel from "@/models/user-role.model";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const userRole = await userRoleModel.findByIdAndDelete(id);

    if (!userRole) {
      return NextResponse.json(
        { success: false, message: "User role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User role removed successfully",
    });
  } catch (err: any) {
    console.error("USER ROLE DELETE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "User role deletion failed" },
      { status: 400 }
    );
  }
}
