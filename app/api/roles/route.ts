import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import roleModel from "@/models/role.model";
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

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Role name is required" },
        { status: 400 }
      );
    }

    const role = await roleModel.create({
      name,
      description,
    });

    return NextResponse.json({
      success: true,
      data: role,
      message: "Role created successfully",
    });
  } catch (err: any) {
    console.error("ROLE CREATE ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Role creation failed" },
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

    const roles = await roleModel.find();

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (err: any) {
    console.error("ROLE GET ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch roles" },
      { status: 400 }
    );
  }
}
