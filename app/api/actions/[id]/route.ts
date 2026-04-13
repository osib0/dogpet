import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import actionModel from "@/models/action.model";
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

    const action = await actionModel.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    );

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: action,
      message: "Action updated successfully",
    });
  } catch (err: any) {
    console.error("ACTION UPDATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Action update failed" },
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

    const action = await actionModel.findByIdAndDelete(id);

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Action deleted successfully",
    });
  } catch (err: any) {
    console.error("ACTION DELETE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Action deletion failed" },
      { status: 400 }
    );
  }
}
