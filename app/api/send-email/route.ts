import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendpulse";

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();
    const data = await sendEmail(to, subject, html);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Email failed" },
      { status: 500 }
    );
  }
}
