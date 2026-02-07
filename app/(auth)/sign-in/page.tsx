"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Oauth from "@/shared/elements/oauth";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Page() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [submiting, setSubmitting] = useState(false);
  const [isError, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
        onRequest: () => {},
      },
    );

    setSubmitting(false);
  }

  useEffect(() => {
    if (session?.user) {
      router.replace("/dashboard");
    }
  }, [session, router]);
  return (
    <div className="grid h-screen place-items-center bg-gray-50">
      <div className="w-full max-w-100 rounded-xl bg-white border">
        <div className="px-5 pt-5 rounded-lg">
          <div className="w-full flex justify-center pb-4">
            <Link href={"/"} className="overflow-hidden">
              <Image
                src={"logo.svg"}
                alt="logo"
                className="object-cover"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <p className="text-center font-normal text-xs  mb-4">
            Welcome back! Please sign in to continue
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative group">
                      <FormControl>
                        <Input
                          className="peer shadow-none text-xs h-11 pt-4"
                          disabled={submiting}
                          autoComplete="off"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        className="
        absolute left-4 top-1/2
        -translate-y-1/2
        text-xs text-gray-600
        pointer-events-none
        transition-all duration-200

        group-focus-within:top-2
        group-focus-within:translate-y-0
        group-focus-within:text-[10px]

        peer-not-placeholder-shown:top-2
        peer-not-placeholder-shown:translate-y-0
        peer-not-placeholder-shown:text-[10px]
      "
                      >
                        Email
                      </FormLabel>
                    </div>

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative group">
                      <FormControl>
                        <Input
                          className="peer shadow-none text-xs h-11 pt-4"
                          autoComplete="off"
                          disabled={submiting}
                          type="password"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        className="
        absolute left-4 top-1/2
        -translate-y-1/2
        text-xs text-gray-600
        pointer-events-none
        transition-all duration-200

        group-focus-within:top-2
        group-focus-within:translate-y-0
        group-focus-within:text-[10px]

        peer-not-placeholder-shown:top-2
        peer-not-placeholder-shown:translate-y-0
        peer-not-placeholder-shown:text-[10px]
      "
                      >
                        Password
                      </FormLabel>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                variant={"outline"}
                disabled={submiting}
                className="shadow-none w-full text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer"
              >
                {submiting ? (
                  "Submitting..."
                ) : (
                  <>
                    <span className="flex-1">Continue</span> <ChevronRight />
                  </>
                )}
              </Button>
              <div className="text-sm text-center text-gray-500 flex items-center">
                <span className="w-full h-px bg-gray-300"></span>
                <span className="px-2">or</span>
                <span className="w-full h-px bg-gray-300"></span>
              </div>
            </form>
          </Form>
          <div className="flex items-center justify-center mt-3 pb-3">
            <Oauth />
          </div>
          <p className="text-red-500 text-sm text-center pb-2">{isError}</p>
        </div>
        <div className="p-3 rounded-lg text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary text-xs hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
