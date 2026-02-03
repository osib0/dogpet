import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import booksModel from "@/models/books.model";
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

    const bookCount = await booksModel.countDocuments({ librarian_id: userId });

    if (!isProActive && bookCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Free plan limit reached. You can only add 5 books. Upgrade to Pro for unlimited books.",
        },
        { status: 403 }
      );
    }

    const form = await req.formData();

    const book = await booksModel.create({
      librarian_id: userId,
      title: form.get("title"),
      author: form.get("author"),
      isbn: form.get("isbn"),
      category: form.get("category"),
      publisher: form.get("publisher"),
      year: Number(form.get("year")),
      totalCopies: Number(form.get("totalCopies")),
      availableCopies: Number(form.get("availableCopies")),
      price: Number(form.get("price")),
      description: form.get("description") || "",
    });

    return NextResponse.json({
      success: true,
      data: book,
      message: "Book added successfully",
    });
  } catch (err: any) {
    console.error("BOOK ADD ERROR", err);
    return NextResponse.json(
      { success: false, message: err.message || "Book add failed" },
      { status: 400 }
    );
  }
}
