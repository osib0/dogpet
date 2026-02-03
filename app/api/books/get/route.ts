import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import booksModel from "@/models/books.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    const librarianId = session.user.id;

    const books = await booksModel
      .find({ librarian_id: librarianId })
      .sort({ createdAt: -1 });
    if (!books) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
