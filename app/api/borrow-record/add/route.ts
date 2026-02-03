import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";

import borrowRecordModel from "@/models/borrowRecord.model";
import bookModel from "@/models/books.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ---- SESSION CHECK ----
    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const librarian_id = session.user.id;

    // ---- BODY DATA ----
    const body = await req.json();
    const { member_id, book_id, borrow_date, return_date, status } = body;

    if (!member_id || !book_id) {
      return NextResponse.json(
        { success: false, message: "Member and Book are required" },
        { status: 400 }
      );
    }

    // ---- BOOK CHECK ----
    const book = await bookModel.findById(book_id);

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    // ---- AVAILABLE COPIES CHECK ----
    if (book.availableCopies <= 0) {
      return NextResponse.json(
        { success: false, message: "No copies available" },
        { status: 400 }
      );
    }

    // ---- SAME USER SAME BOOK AGAIN? ----
    const alreadyBorrowed = await borrowRecordModel.findOne({
      member_id,
      book_id,
      status: { $ne: "Returned" },
    });

    if (alreadyBorrowed) {
      return NextResponse.json(
        {
          success: false,
          message: "This member already has this book issued",
        },
        { status: 400 }
      );
    }

    // ---- CREATE RECORD ----
    const newRecord = await borrowRecordModel.create({
      librarian_id,
      member_id,
      book_id,
      borrow_date: borrow_date ? new Date(borrow_date) : new Date(),
      return_date: return_date ? new Date(return_date) : null,
      status: status || "Borrowed",
    });

    // ---- DECREASE AVAILABLE COPIES ----
    book.availableCopies -= 1;
    await book.save();

    return NextResponse.json(
      {
        success: true,
        message: "Borrow record added successfully",
        data: newRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Server error",
      },
      { status: 500 }
    );
  }
}
