"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    popular: false,
    features: ["Access to free books", "Limited downloads", "Basic analytics"],
  },
  {
    name: "Pro",
    price: { monthly: 15, yearly: 144 },
    popular: true,
    features: [
      "Unlimited book access",
      "Priority support",
      "Offline downloads",
      "Reading statistics",
    ],
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Plan = {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  popular: boolean;
  features: string[];
};

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handlePayment = async (plan: Plan) => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    if (plan.price.monthly === 0) {
      toast.success("Free plan activated");
      return;
    }

    const amount = yearly ? plan.price.yearly : plan.price.monthly;

    // 1️⃣ Create Order
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const order = await res.json();

    // 2️⃣ Razorpay Options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: `${plan.name} Plan`,
      description: `${plan.name} Subscription`,
      order_id: order.id,
      prefill: {
        name: session?.user.name,
        email: session?.user.email
      },
      handler: async function (response: any) {
        // 3️⃣ Verify Payment & Save Subscription
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planName: plan.name,
            isYearly: yearly,
          }),
        });
        const data = await verifyRes.json();
        if (data.success) {
          toast.success("Subscription Activated 🎉");
        } else {
          toast.error("Payment verification failed ❌");
        }
      },
      theme: {
        color: "#111827",
      },
    };

    // 4️⃣ Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <div className="max-w-6xl mx-auto text-center mb-12">
        <Badge variant="secondary" className="mb-2">
          Pricing
        </Badge>
        <h1 className="text-4xl font-bold mb-2">
          Choose the plan that fits you best
        </h1>
        <p className="text-muted-foreground">
          Access thousands of books and tools for your library management —
          upgrade anytime.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <span
            className={`text-sm ${!yearly ? "text-primary font-medium" : ""}`}
          >
            Monthly
          </span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span
            className={`text-sm ${yearly ? "text-primary font-medium" : ""}`}
          >
            Yearly (Save 20%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className="p-1 bg-gray-50 rounded-2xl border">
            <Card
              className={`relative border-0 ${plan.popular ? "shadow-none" : ""
                } hover:shadow-xl transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  {plan.name}
                </CardTitle>
                <p className="text-4xl font-bold mt-2">
                  ${yearly ? plan.price.yearly : plan.price.monthly}
                  <span className="text-base font-normal text-muted-foreground">
                    /{yearly ? "year" : "month"}
                  </span>
                </p>
              </CardHeader>

              <CardContent className="space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {!plan.popular && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4" />
                    <span className="text-sm">No premium analytics</span>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handlePayment(plan)}
                  className={`w-full ${plan.popular
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-800"
                    }`}
                >
                  {plan.popular ? "Get Started" : "Choose Plan"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default Pricing;
