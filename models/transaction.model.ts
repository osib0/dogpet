import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowedAt: { type: Date, default: Date.now },
  dueAt: { type: Date, required: true },
  returnedAt: { type: Date },
  status: { type: String, enum: ["borrowed", "returned", "overdue"], default: "borrowed" },
  createdAt: { type: Date, default: Date.now },
});

const transactionModel =
  mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
export default transactionModel;
