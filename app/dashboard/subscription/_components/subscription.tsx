"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Subscription = {
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
  isYearly: boolean;
};

export const plans = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Up to 5 students",
      "Up to 5 books",
      "Basic support",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 100, yearly: 1000 },
    features: [
      "Unlimited students",
      "Unlimited books",
      "Automated reminders Email",
      "Due date notifications",
    ],
  },
];


export default function Subscription() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [yearly, setYearly] = useState<boolean>(false);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [bookCount, setBookCount] = useState<number>(0);
  const [isPayLoading, setPayLoading] = useState<boolean>(false);

  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  const router = useRouter();

  // -------------------------
  // FETCH USER PLAN
  // -------------------------
  useEffect(() => {
    if (!userId) return;
    (async function () {
      try {
        const res = await fetch(`/api/subscribtion/get/${session.user.id}`);
        const data = await res.json();
        setSubscription(data?.subscription || null);
        console.log(data, 'data.subscription')
        // members & books
        const [membersRes, booksRes] = await Promise.all([
          fetch("/api/members/get").then((r) => r.json()),
          fetch("/api/books/get").then((r) => r.json()),
        ]);

        console.log(membersRes, 'data.subscription')
        console.log(booksRes, 'data.subscription')
        if (membersRes.success) setStudentCount(membersRes.data.length);
        if (booksRes.success) setBookCount(booksRes.data.length);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })()

  }, [userId]);

  // -------------------------
  // HANDLE PAYMENT
  // -------------------------
  const handlePayment = async (selectedPlan: typeof plans[0]) => {
    setPayLoading(true)
    if (!session?.user) {
      router.push("/sign-in");
      setPayLoading(false)
      return;
    }

    const amount = yearly ? selectedPlan.price.yearly : selectedPlan.price.monthly;

    if (amount === 0) {
      const verify = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: "",
          razorpay_payment_id: "",
          razorpay_signature: "",
          planName: selectedPlan.name,
          isYearly: yearly,
        }),
      });

      const data = await verify.json();

      if (data.success) {
        toast.success("Subscription Activated 🎉");
        location.reload();
        setPayLoading(false)
      } else {
        toast.error("Activation failed ❌");
        setPayLoading(false)
      }
      return;
    }

    // 1️⃣ Create Razorpay order
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
      name: `${selectedPlan.name} Plan`,
      description: "Library Subscription",
      order_id: order.id,
      prefill: {
        name: session?.user.name,
        email: session?.user.email,
      },
      handler: async function (response: any) {
        const verify = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planName: selectedPlan.name,
            isYearly: yearly,
          }),
        });

        const data = await verify.json();

        if (data.success) {
          toast.success("Subscription Activated 🎉");
          location.reload();
          setPayLoading(false)
        } else {
          toast.error("Payment verification failed ❌");
          setPayLoading(false)

        }
      },
      modal: {
        ondismiss: function () {
          setPayLoading(false);
          toast.error("Payment cancelled");
        }
      },
      theme: { color: "#111827" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // -------------------------
  // UI LOGIC
  // -------------------------
  if (loading) {
    return (
      <div className="flex flex-col px-4">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-5xl mx-auto mb-8">
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  const expired = subscription && new Date(subscription.endDate) < new Date();

  const isAnyPlanActive = !!subscription && subscription.status === "active" && !expired;

  const currentPlan = subscription?.planId ?? "Starter";

  const limits =
    currentPlan === "Pro" && !expired
      ? { students: "Unlimited", books: "Unlimited" }
      : { students: "5", books: "5" };

  const isSubscribedToPro = currentPlan === "Pro" && !expired;

  const hasMonthlyPro =
    subscription?.planId === "Pro" &&
    !subscription?.isYearly &&
    !expired;

  const hasYearlyPro =
    subscription?.planId === "Pro" &&
    subscription?.isYearly &&
    !expired;

  const getButtonLabel = () => {
    if (hasYearlyPro) return "Yearly Plan Active";

    if (hasMonthlyPro && yearly) {
      return "Upgrade to Yearly – ₹1000";
    }

    if (hasMonthlyPro && !yearly) {
      return "Monthly Plan Active";
    }

    if (yearly) return "Choose Pro – ₹1000 / year";

    return "Choose Pro – ₹100 / month";
  };


  return (
    <div className="flex flex-col px-4 bg-[#f7f7f8]">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10">
        {/* Current Subscription Card */}
        <div className="max-w-5xl mx-auto mb-4">
          <Card className="bg-white rounded-xl shadow-none">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Manage your library plan and usage.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Plan:{" "}
                    <Badge className="bg-green-100 text-black/80">
                      {currentPlan}
                    </Badge>
                  </p>
                  {subscription ? (
                    expired ? (
                      <p className="text-sm text-red-600 mt-1">
                        Subscription expired — please renew.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">
                        Active until{" "}
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      Free tier with limited features.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            {!isSubscribedToPro && (
              <CardFooter className="flex justify-end">
                <Button
                  disabled={isPayLoading}
                  onClick={() => handlePayment(plans[1])}
                  className="bg-blue-500 hover:bg-blue-700 cursor-pointer"
                >
                  {isPayLoading
                    ? "Processing..."
                    : expired
                      ? yearly
                        ? "Renew Pro – ₹1000 / year"
                        : "Renew Pro – ₹100 / month"
                      : yearly
                        ? "Upgrade to Pro – ₹1000 / year"
                        : "Upgrade to Pro – ₹100 / month"}
                </Button>
              </CardFooter>

            )}
          </Card>
        </div>
        {/* Usage Limits Grid */}
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3 mb-12">
          <Card className="bg-white rounded-xl shadow-none">
            <CardHeader className="pb-2">
              <CardDescription>Students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {studentCount}
                <span className="text-sm text-muted-foreground ml-1">
                  / {limits.students}
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl shadow-none">
            <CardHeader className="pb-2">
              <CardDescription>Books</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {bookCount}
                <span className="text-sm text-muted-foreground ml-1">
                  / {limits.books}
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl shadow-none">
            <CardHeader className="pb-2">
              <CardDescription>Next Billing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {subscription && !expired
                  ? new Date(subscription.endDate).toLocaleDateString()
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-muted-foreground mb-4">
              Select the best plan for your library needs.
            </p>
            <div className="flex items-center justify-center gap-2">
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
          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.name && !expired;
              const price = yearly ? plan.price.yearly : plan.price.monthly;
              const period = yearly ? "/year" : "/month";
              const monthlyEquivalent = yearly
                ? `(₹${Math.round(plan.price.yearly / 12)}/mo)`
                : "";
              const disableButton =
                (plan.name === "Starter" && isAnyPlanActive) ||
                (plan.name === "Pro" &&
                  (
                    hasYearlyPro ||
                    (hasMonthlyPro && !yearly)
                  ));

              const buttonLabel = plan.name === "Starter"
                ? (isAnyPlanActive ? "Current Plan" : "Free Plan")
                : getButtonLabel();

              return (
                <Card
                  key={plan.name}
                  className={isCurrent ? "border-green-500" : ""}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {price === 0
                        ? "Free forever"
                        : `₹${price} ${period} ${monthlyEquivalent}`}

                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-full">
                    <ul className="list-disc pl-5 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      disabled={disableButton || isPayLoading}
                      onClick={() => handlePayment(plan)}
                      className={`w-full text-white
    ${disableButton || isPayLoading
                          ? "bg-green-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                        }
  `}
                    >
                      {isPayLoading ? "Processing..." : buttonLabel}
                    </Button>

                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}