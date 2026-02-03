'use client'

// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function VerifyEmailPage() {
    // const { data: session } = authClient.useSession();
    // const router = useRouter()

    // useEffect(() => {
    //     if (!session?.user?.emailVerified) {
    //         router.replace("/dashboard");
    //     }
    // }, [session, router]);

    return (
        <div className="grid h-screen place-items-center text-center px-4">
            <div className="max-w-md space-y-4">
                <h1 className="text-xl font-semibold">Verify your email</h1>
                <p className="text-sm text-gray-600">
                    We have sent a verification link to your email address.
                    Please check your inbox and click the link to continue.
                </p>
                <p className="text-xs text-gray-400">
                    Didn’t receive the email? Check spam folder.
                </p>
            </div>
        </div>
    );
}
