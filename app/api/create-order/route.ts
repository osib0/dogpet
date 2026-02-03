// /api/create-order/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // ✅ rupees → paise
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR", err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
