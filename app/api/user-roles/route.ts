import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import userRoleModel from "@/models/user-role.model";
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

    const { user_id, role_id } = await req.json();

    if (!user_id || !role_id) {
      return NextResponse.json(
        { success: false, message: "user_id and role_id are required" },
        { status: 400 }
      );
    }

    // Check if user already has this role
    let userRole = await userRoleModel.findOne({ user_id, role_id });

    if (userRole) {
      return NextResponse.json(
        { success: false, message: "User already has this role" },
        { status: 400 }
      );
    }

    userRole = await userRoleModel.create({
      user_id,
      role_id,
    });

    return NextResponse.json({
      success: true,
      data: userRole,
      message: "Role assigned to user successfully",
    });
  } catch (err: any) {
    console.error("USER ROLE CREATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "User role assignment failed" },
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
    const userId = searchParams.get("user_id");

    let query: any = {};
    if (userId) query.user_id = userId;

    const userRoles = await userRoleModel
      .find(query)
      .populate("role_id");

    return NextResponse.json({
      success: true,
      data: userRoles,
    });
  } catch (err: any) {
    console.error("USER ROLE GET ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch user roles" },
      { status: 400 }
    );
  }
}
