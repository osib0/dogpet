import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/db";
import membersModel from "@/models/members.model";
import LibraryReminderEmail from "@/emails/reminder";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { ids, subject, message } = await req.json();

    if (!ids?.length || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const members = await membersModel.find({
      _id: { $in: ids },
      email: { $exists: true, $ne: "" },
    });

    if (!members.length) {
      return NextResponse.json(
        { success: false, message: "No valid members found" },
        { status: 400 }
      );
    }

    for (const member of members) {
      await resend.emails.send({
        from: "Library <noreply@libease.co.in>",
        to: member.email,
        subject,
        react: LibraryReminderEmail({
          name: member.fullName,
          message,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Email reminders sent successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
