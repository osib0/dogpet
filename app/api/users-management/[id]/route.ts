import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import userModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function PUT(
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

    const { username, email, status } = await req.json();

    const user = await userModel.findByIdAndUpdate(
      id,
      { username, email, status },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (err: any) {
    console.error("USER UPDATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "User update failed" },
      { status: 400 }
    );
  }
}

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

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    console.error("USER DELETE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "User deletion failed" },
      { status: 400 }
    );
  }
}
