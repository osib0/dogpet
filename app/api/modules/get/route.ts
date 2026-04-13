import { NextResponse } from "next/server";
import Module from "@/models/module.model";
import { connectDB } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await connectDB();
    const modules = await Module.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, modules }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch modules" },
      { status: 500 }
    );
  }
}
