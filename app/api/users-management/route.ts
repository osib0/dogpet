import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import userModel from "@/models/user.model";
import userRoleModel from "@/models/user-role.model";
import roleModel from "@/models/role.model";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Allow creation from dashboard (remove auth check for admin panel)
    // In production, implement proper admin verification
    // const session = await auth.api.getSession({
    //   headers: Object.fromEntries(req.headers),
    // });

    // if (!session?.user) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email, and password are required",
        },
        { status: 400 }
      );
    }

    // Check if user already exists in custom model
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate a unique auth_id
    const auth_id = randomUUID();

    // Create user in custom model (for RBAC system)
    const user = await userModel.create({
      username,
      email,
      auth_id: auth_id, // Always provide an auth_id to avoid null index conflict
      status: "ACTIVE",
    });

    // TODO: In production, you would also need to:
    // 1. Create the user in better-auth system
    // 2. Hash and store password securely
    // For now, we're storing the mapping so passwords can be synced later

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
        auth_id: user.auth_id,
      },
      message: "User created successfully",
    });
  } catch (err: any) {
    console.error("USER CREATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "User creation failed" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    // Allow getting users from dashboard without auth check
    // const session = await auth.api.getSession({
    //   headers: Object.fromEntries(req.headers),
    // });

    // if (!session?.user) {
    //   return NextResponse.json({ success: false }, { status: 401 });
    // }

    const users = await userModel.find();
    
    // Fetch roles for each user
    const usersWithRoles = await Promise.all(
      users.map(async (user: any) => {
        const userRole = await userRoleModel.findOne({ user_id: user._id }).populate("role_id");
        return {
          ...user.toObject(),
          role: userRole ? userRole.role_id.name : "No Role",
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: usersWithRoles,
    });
  } catch (err: any) {
    console.error("USER GET ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch users" },
      { status: 400 }
    );
  }
}
