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
import toast from "react-hot-toast";
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
        onRequest: () => { },
      }
    );

    setSubmitting(false);
  }

  useEffect(() => {
    if (session?.user) {
      router.replace("/dashboard");
    }
  }, [session, router]);
  return (
    <div className="grid h-screen place-items-center">
      <div className="w-full max-w-100 px-1 py-1 rounded-xl bg-gray-50 border">
        <div className="px-5 bg-white rounded-lg">
          <div className="w-fulll grid justify-center">
            <Link href={"/"} className="">
              <Image width={100} height={50} src={'logo-main.svg'} alt="logo" />
            </Link>
          </div>
          <p className="text-center font-light text-sm mb-2">
            Welcome back! Please sign in to continue
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={submiting}
                        placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={submiting}
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={submiting}
                className="w-full bg-linear-to-r to-blue-600 from-blue-500 hover:from-blue-600 rounded-md  hover:to-blue-700"
              >
                {submiting ? (
                  "Loading..."
                ) : (
                  <>
                    Continue <ChevronRight />
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
        <div className="bg-gray-50 p-3  rounded-lg text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
