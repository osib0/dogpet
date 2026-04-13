import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import permissionModel from "@/models/permission.model";
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

    const { role_id, module_id, action_ids } = await req.json();

    if (!role_id || !module_id) {
      return NextResponse.json(
        { success: false, message: "role_id and module_id are required" },
        { status: 400 }
      );
    }

    // Check if permission already exists
    let permission = await permissionModel.findOne({ role_id, module_id });

    if (permission) {
      // Update existing permission
      permission.action_ids = action_ids || [];
      await permission.save();
    } else {
      // Create new permission
      permission = await permissionModel.create({
        role_id,
        module_id,
        action_ids: action_ids || [],
      });
    }

    return NextResponse.json({
      success: true,
      data: permission,
      message: "Permission saved successfully",
    });
  } catch (err: any) {
    console.error("PERMISSION CREATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Permission creation failed" },
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
    const roleId = searchParams.get("role_id");
    const moduleId = searchParams.get("module_id");

    let query: any = {};
    if (roleId) query.role_id = roleId;
    if (moduleId) query.module_id = moduleId;

    const permissions = await permissionModel
      .find(query)
      .populate("role_id")
      .populate("module_id")
      .populate("action_ids");

    return NextResponse.json({
      success: true,
      data: permissions,
    });
  } catch (err: any) {
    console.error("PERMISSION GET ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch permissions" },
      { status: 400 }
    );
  }
}
