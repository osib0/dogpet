import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import subscriptionModel from "@/models/subscription.model";

export async function GET(req: Request, { params }: any) {
  try {
    await connectDB();

    const { userId } =await params;

    const subscription = await subscriptionModel
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!subscription) {
      return NextResponse.json(
        { success: true, subscription: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscription,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET subscription error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
