import { connectDB } from "@/lib/db";
import booksModel from "@/models/books.model";
import { NextResponse } from "next/server";

export async function PUT(req:Request,{params}:any) {
  try {
    const {id} = await params
    await connectDB();
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Book ID is required" },
        { status: 400 }
      );
    }

    const updatedBook = await booksModel.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updatedBook) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error:any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}