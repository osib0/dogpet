import { NextResponse } from "next/server";
import Module from "@/models/module.model";
import { connectDB } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Module ID is required" },
        { status: 400 }
      );
    }

    const deletedModule = await Module.findByIdAndDelete(id);

    if (!deletedModule) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Module deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete module" },
      { status: 500 }
    );
  }
}
