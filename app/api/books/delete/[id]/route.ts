import { connectDB } from "@/lib/db";
import booksModel from "@/models/books.model";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:any) {
  try {
    const {id} = await params
    await connectDB();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Book ID is required" },
        { status: 400 }
      );
    }

    const deletedBook = await booksModel.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error:any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}