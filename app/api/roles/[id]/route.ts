import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import roleModel from "@/models/role.model";
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

    const { name, description, status } = await req.json();

    const role = await roleModel.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    );

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
      message: "Role updated successfully",
    });
  } catch (err: any) {
    console.error("ROLE UPDATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Role update failed" },
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

    const role = await roleModel.findByIdAndDelete(id);

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (err: any) {
    console.error("ROLE DELETE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Role deletion failed" },
      { status: 400 }
    );
  }
}
