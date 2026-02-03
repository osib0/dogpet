import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    librarian_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Librarian",
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },

    enrollmentId: { type: String, required: true, trim: true },

    joinDate: { type: Date, required: true },

    monthlyFee: { type: Number, default: 0 },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    address: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model("Member", memberSchema);
