import { NextResponse } from "next/server";
import Module from "@/models/module.model";
import { connectDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { page_name, status, description } = await request.json();

    if (!page_name) {
      return NextResponse.json(
        { error: "Page name is required" },
        { status: 400 }
      );
    }

    const newModule = await Module.create({
      page_name,
      status: status || "ACTIVE",
      description,
    });

    return NextResponse.json(
      { success: true, module: newModule },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add module" },
      { status: 500 }
    );
  }
}
