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
import { ChevronRight, Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { CustomSpinner } from "@/shared/elements/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be less than 20 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

const passwordRules = [
  {
    label: "Password must be at least 8 characters long",
    test: (v: string) => v.length >= 8,
  },
  {
    label: "Password must be less than 20 characters",
    test: (v: string) => v.length <= 20,
  },
  {
    label: "Password must contain at least one uppercase letter",
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    label: "Password must contain at least one lowercase letter",
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    label: "One number (0-9)",
    test: (v: string) => /[0-9]/.test(v),
  },
  {
    label: "One special character (!@#$)",
    test: (v: string) => /[^a-zA-Z0-9]/.test(v),
  },
];
export default function Page() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [submiting, setSubmitting] = useState(false);
  const [isShowPass, setShowPass] = useState<boolean>(false);
  const [isError, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const passwordValue = form.watch("password");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    const { data, error } = await authClient.signIn.email(
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
      },
    );

    if (data) {
    } else {
      console.log(error, "rewrew");
    }

    setSubmitting(false);
  }

  useEffect(() => {
    if (session?.user) {
      router.replace("/dashboard");
    }
  }, [session, router]);




  return (
    <div className="h-screen w-screen flex">
      <div className="bg-gray-50 border-r p-5 shadow-xl max-w-full xl:max-w-187 w-full z-10 flex flex-col items-center">
        <div className="w-full flex pb-4">
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
        <div className="w-full h-full max-w-lg flex flex-col justify-center">
          <h1 className="text-start w-full text-3xl mb-3">Welcome back!</h1>
          <p className="w-full text-start text-sm text-muted-foreground mb-8">
            Please sign in to continue
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="shadow-none"
                        disabled={submiting}
                        autoComplete="off"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs">
                      Password
                    </FormLabel>
                    <FormControl>
                      <InputGroup className="shadow-none">
                        <InputGroupInput
                          autoComplete="off"
                          disabled={submiting}
                          type={`${isShowPass ? "text" : "password"}`}
                          placeholder="••••••••••"
                          {...field}
                        />
                        <InputGroupAddon
                          align="inline-end"
                          className="cursor-pointer"
                        >
                          {isShowPass ? (
                            <EyeClosed onClick={() => setShowPass(false)} />
                          ) : (
                            <Eye onClick={() => setShowPass(true)} />
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="mt-2 space-y-1">
                {form.watch("password") &&
                  passwordRules.map((rule, index) => {
                    const isValid = rule.test(passwordValue || "");

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center
            ${isValid ? "text-[#72e3ad]" : ""}
          `}
                        >
                          ✓
                        </span>
                        <span
                          className={
                            isValid ? "text-green-600" : "text-gray-500"
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
              </div>

              <Button
                variant={"outline"}
                disabled={submiting}
                className="shadow-none w-full text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer"
              >
                {submiting ? (
                  <CustomSpinner />
                ) : (
                  <>
                    <span className="flex-1">Sign in</span> <ChevronRight />
                  </>
                )}
              </Button>
            </form>
          </Form>
          <p className="text-red-500 text-sm text-center mt-3">{isError}</p>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          © 2026 DogPet Clinic. All rights reserved.
        </p>
      </div>
      <div className="hidden xl:flex flex-1 items-center justify-center bg-white w-auto">
        <div className="max-w-xl relative px-16">
          <span className="text-7xl text-gray-200 absolute left-0">“</span>
          <p className="text-2xl font-medium text-gray-900 leading-relaxed mb-8 mt-0 m-0">
            I gave this platform a try and I was able to build a complete
            dashboard to manage pets, appointments and billing in minutes. It’s
            simple, fast and production ready.
          </p>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Osib</p>
              <p className="text-sm text-gray-500">@osibdev</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
