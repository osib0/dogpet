import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import actionModel from "@/models/action.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { name, module_id, description } = await req.json();

    if (!name || !module_id) {
      return NextResponse.json(
        { success: false, message: "Name and module_id are required" },
        { status: 400 }
      );
    }

    const action = await actionModel.create({
      name,
      module_id,
      description,
    });

    return NextResponse.json({
      success: true,
      data: action,
      message: "Action created successfully",
    });
  } catch (err: any) {
    console.error("ACTION CREATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Action creation failed" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("module_id");

    let query: any = {};
    if (moduleId) {
      query.module_id = moduleId;
    }

    const actions = await actionModel.find(query).populate("module_id");

    return NextResponse.json({
      success: true,
      data: actions,
    });
  } catch (err: any) {
    console.error("ACTION GET ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch actions" },
      { status: 400 }
    );
  }
}
