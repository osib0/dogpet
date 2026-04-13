import { NextResponse } from "next/server";
import Module from "@/models/module.model";
import { connectDB } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, page_name, status, description } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Module ID is required" },
        { status: 400 }
      );
    }

    const updatedModule = await Module.findByIdAndUpdate(
      id,
      { page_name, status, description },
      { new: true }
    );

    if (!updatedModule) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, module: updatedModule },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update module" },
      { status: 500 }
    );
  }
}
