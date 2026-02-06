// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { ChevronRight } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import Image from "next/image";

// const formSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(8, {
//     message: "Password must be at least 8 characters.",
//   }),
// });

// export default function Page() {
//   const router = useRouter();
//   const { data: session } = authClient.useSession();
//   const [submiting, setSubmitting] = useState(false);
//   const [isError, setError] = useState<string>("");


//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setSubmitting(true);
//     await authClient.signUp.email(
//       {
//         name: values.name,
//         email: values.email,
//         password: values.password,
//       },
//       {
//         onSuccess: () => {
//           router.push("/verify-email");
//         },
//         onError: (ctx) => {
//           setError(ctx.error.message);
//         },
//       }
//     );

//     setSubmitting(false);
//   }


//   useEffect(() => {
//     if (session?.user?.emailVerified) {
//       router.replace("/dashboard");
//     }
//   }, [session, router]);

//   return (
//     <div className="grid h-screen place-items-center">
//       <div className="w-full max-w-100 px-1 py-1 rounded-xl bg-gray-50 border">
//         <div className="px-5 py-5 bg-white rounded-lg">
//           <div className="w-fulll grid justify-center">
//             <Link href={"/"} className="">
//               <Image width={100} height={50} src={'logo-main.svg'} alt="logo" />
//             </Link>
//           </div>
//           <p className="text-center font-light text-sm mb-3">
//             Welcome! Please fill in the details to get started
//           </p>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 disabled={submiting}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs text-gray-600">
//                       Name
//                     </FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter your name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs text-gray-600">
//                       Email address
//                     </FormLabel>
//                     <FormControl>
//                       <Input disabled={submiting} placeholder="Enter your email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs text-gray-600">
//                       Password
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         disabled={submiting}
//                         placeholder="password"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 disabled={submiting}
//                 className="w-full bg-linear-to-r cursor-pointer to-blue-600 from-blue-500 hover:from-blue-600 rounded-md  hover:to-blue-700"
//               >
//                 {submiting ? (
//                   "Loading..."
//                 ) : (
//                   <>
//                     Continue <ChevronRight />
//                   </>
//                 )}
//               </Button>
//             </form>
//           </Form>
//           <p className="text-red-500 text-sm text-center pb-2">{isError}</p>
//         </div>
//         <div className="bg-gray-50 p-3 rounded-lg mt-5 text-center text-sm text-gray-500">
//           Already have an account?{" "}
//           <Link href="/sign-in" className="text-primary hover:underline">
//             Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'

export default function Page() {
  return (
    <div>Page</div>
  )
}

