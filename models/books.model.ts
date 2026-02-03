import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    librarian_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Librarian",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    totalCopies: { type: Number, required: true, default: 1 },
    availableCopies: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const booksModel = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default booksModel;
