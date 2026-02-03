import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    planId: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isYearly: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "upgraded", "expired", "cancelled"],
      default: "active",
    },

    razorpayPaymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const subscriptionModel =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

export default subscriptionModel;
