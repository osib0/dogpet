import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import subscriptionModel from "@/models/subscription.model";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      isYearly,
    } = await req.json();

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("SIGNATURE MISMATCH");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const activeSub = await subscriptionModel.findOne({
      userId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (activeSub?.isYearly) {
      return NextResponse.json(
        { success: false, message: "Yearly plan already active" },
        { status: 400 }
      );
    }

    if (activeSub && !activeSub.isYearly && !isYearly) {
      return NextResponse.json(
        { success: false, message: "Monthly plan already active" },
        { status: 400 }
      );
    }

    if (activeSub && !activeSub.isYearly && isYearly) {
      activeSub.status = "upgraded";
      activeSub.endDate = new Date();
      await activeSub.save();
    }

    const startDate = new Date();
    const endDate = new Date();

    isYearly
      ? endDate.setFullYear(endDate.getFullYear() + 1)
      : endDate.setMonth(endDate.getMonth() + 1);

    await subscriptionModel.create({
      userId,
      planId: planName,
      startDate,
      endDate,
      status: "active",
      razorpayPaymentId: razorpay_payment_id,
      isYearly,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR", err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
