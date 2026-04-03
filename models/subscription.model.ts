import { Schema, models, model } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    userId: { type: String, required: true },
    planName: { type: String, required: true },
    isYearly: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive", "cancelled"], default: "active" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
  },
  { timestamps: true }
);

export default models.Subscription || model("Subscription", SubscriptionSchema);