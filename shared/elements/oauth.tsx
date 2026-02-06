"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import google from "@/public/image/icons/google.png";
import { Spinner } from "./spinner";
import { authClient } from "@/lib/auth-client";

const Oauth = () => {
  const [submitting, setSubmitting] = useState<null | "google">(null);

  const signInWithGoogle = async () => {
    try {
      setSubmitting("google");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      setSubmitting(null);
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant="outline"
      disabled={submitting === "google"}
      className="flex-1 gap-2 text-xs py-2 cursor-pointer rounded-md shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {submitting === "google" ? (
        <>
          <Spinner />
          <span className="flex-1 -translate-x-2">Connecting…</span>
        </>
      ) : (
        <>
          <Image src={google} alt="Google" width={20} className="me-3" />
          <span className="flex-1 -translate-x-4">
            Continue with Google
          </span>
        </>
      )}
    </Button>
  );
};

export default Oauth;
