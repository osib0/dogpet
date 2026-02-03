import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import membersModel from "@/models/members.model";
import subscriptionModel from "@/models/subscription.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const subscription = await subscriptionModel
      .findOne({ userId })
      .sort({ createdAt: -1 });

    const now = new Date();

    const isProActive =
      subscription &&
      subscription.planId === "Pro" &&
      subscription.endDate > now &&
      subscription.status === "active";

    const memberCount = await membersModel.countDocuments({
      librarian_id: userId,
    });

    if (!isProActive && memberCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Free plan limit reached. You can only add 5 students. Upgrade to Pro for unlimited students.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      enrollmentId,
      joinDate,
      monthlyFee,
      status,
      address,
    } = body;

    if (!fullName || !email || !enrollmentId) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const existing = await membersModel.findOne({
      enrollmentId,
      librarian_id: userId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Enrollment ID already exists" },
        { status: 400 }
      );
    }

    const member = await membersModel.create({
      librarian_id: userId,
      fullName,
      email,
      phone,
      enrollmentId,
      joinDate,
      monthlyFee,
      status,
      address,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student added successfully",
        data: member,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("ADD MEMBER ERROR", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      let message = "Duplicate value already exists";

      if (field === "email") {
        message = "This email is already registered";
      }

      if (field === "enrollmentId") {
        message = "Enrollment ID already exists";
      }

      return NextResponse.json(
        { success: false, message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to add student" },
      { status: 500 }
    );
  }

}
