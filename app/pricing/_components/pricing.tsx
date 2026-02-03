"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";


type Plan = {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  popular: boolean;
  features: string[];
};


const plans: Plan[] = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    popular: false,
    features: [
      "Up to 5 students",
      "Up to 5 books",
      "Basic support",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 100, yearly: 1000 },
    popular: true,
    features: [
      "Unlimited students",
      "Unlimited books",
      "Automated reminders Email",
      "Due date notifications",
    ],
  },
];


export default function PricingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [yearly, setYearly] = useState(false);



  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/subscribtion/get/${session.user.id}`)
      .then((res) => res.json())
      .then((data) => setSubscription(data.subscription || null))
      .catch(() => { });
  }, [session?.user?.id]);

  const isPro =
    subscription &&
    subscription.planId === "Pro" &&
    new Date(subscription.endDate) > new Date();

  const handleSelect = (plan: Plan) => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    if (plan.name === "Starter") {
      router.push("/dashboard");
      return;
    } else {
      router.push("/dashboard/subscription");

    }
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-medium mb-2">
          Choose the plan that fits you best
        </h1>

        <p className="text-muted-foreground text-sm mb-4">
          Simple pricing for libraries of all sizes.
        </p>

        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-medium">Monthly</span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className="text-sm font-medium">Yearly</span>

          {yearly && (
            <Badge variant="secondary" className="ml-2">
              Save ₹200
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const price = yearly ? plan.price.yearly : plan.price.monthly;
          const period = yearly ? "/year" : "/month";
          const monthlyEquivalent = yearly && plan.price.yearly
            ? `(₹${Math.round(plan.price.yearly / 12)}/mo)`
            : "";

          return (
            <div
              key={index}
              className={`p-1 bg-gray-50 rounded-2xl border ${plan.popular ? isPro ? "border-green-500" : "border-blue-300" : ""
                }`}
            >
              <Card className="relative border-0 hover:shadow-xl transition-all">
                {/* Badges */}
                {plan.name === "Pro" && isPro && (
                  <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                    Active
                  </span>
                )}

                {plan.name === "Starter" && !isPro && (
                  <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    Current
                  </span>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    {plan.name}
                  </CardTitle>

                  <p className="text-4xl font-bold mt-2">
                    ₹{price}
                    <span className="text-base font-normal text-muted-foreground">
                      {period} {monthlyEquivalent}
                    </span>
                  </p>

                </CardHeader>

                <CardContent className="space-y-3 text-left">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{f}</span>
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
                  {plan.name === "Pro" && isPro ? (
                    <Button disabled className="w-full bg-green-500 text-white">
                      Active Plan
                    </Button>
                  ) : plan.name === "Starter" && isPro ? (
                    <Button disabled className="w-full bg-gray-200 text-gray-500">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelect(plan)}
                      className={`w-full cursor-pointer ${plan.popular
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-black"
                        }`}
                    >
                      {plan.popular
                        ? yearly
                          ? "Choose Pro – ₹1000 / year"
                          : "Choose Pro – ₹100 / month"
                        : "Use Free"}
                    </Button>

                  )}
                </CardFooter>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  );
}
