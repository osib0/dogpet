import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    price: {
      monthly: { type: Number, required: true },
      yearly: { type: Number, required: true },
    },

    features: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const planModel =
  mongoose.models.Plan || mongoose.model("Plan", planSchema);

export default planModel;
