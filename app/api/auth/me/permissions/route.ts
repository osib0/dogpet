import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import UserRole from "@/models/user-role.model";
import Permission from "@/models/permission.model";
import Module from "@/models/module.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // If user not found in local db, maybe they are admin by default or have no permissions
      return NextResponse.json({ success: true, modules: [] });
    }

    const userRoles = await UserRole.find({ user_id: user._id });
    const roleIds = userRoles.map(ur => ur.role_id);

    const permissions = await Permission.find({ role_id: { $in: roleIds } });
    const moduleIds = permissions.map(p => p.module_id);

    const allowedModules = await Module.find({ _id: { $in: moduleIds } });
    const moduleNames = allowedModules.map(m => m.page_name);

    return NextResponse.json({ success: true, modules: moduleNames });
  } catch (error: any) {
    console.error("Error fetching user permissions:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
