"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthCard } from "@/components/shared/auth-card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

type VerifyState = "pending" | "verifying" | "success" | "error";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>(
    token ? "verifying" : "pending",
  );

  useEffect(() => {
    if (!token) return;

    // Track B: replace with real API call -> services/auth.ts:verifyEmail(token)
    const timer = setTimeout(() => setState("success"), 1500);
    return () => clearTimeout(timer);
  }, [token]);

  if (state === "pending") {
    return (
      <AuthCard title="Verify your email">
        <Alert variant="info">
          We&apos;ve sent a verification link to your email address. Click the
          link to activate your account.
        </Alert>
        <p className="text-text-secondary mt-4 text-center text-sm">
          Didn&apos;t get an email?{" "}
          <Link href="/resend-verification" className="font-medium">
            Resend verification email
          </Link>
        </p>
      </AuthCard>
    );
  }

  if (state === "verifying") {
    return (
      <AuthCard title="Verifying your email">
        <div className="flex flex-col items-center gap-3 py-4">
          <Spinner className="h-8 w-8" />
          <p className="text-text-secondary text-sm">
            Hang tight, this only takes a moment...
          </p>
        </div>
      </AuthCard>
    );
  }

  if (state === "error") {
    return (
      <AuthCard title="Verification failed">
        <Alert variant="error">
          This verification link is invalid or has expired.
        </Alert>
        <Link href="/resend-verification" className="mt-6 block">
          <Button className="w-full">Request a new link</Button>
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Email verified">
      <Alert variant="success">
        Your email has been verified. You can now log in to your account.
      </Alert>
      <Link href="/login" className="mt-6 block">
        <Button className="w-full">Continue to login</Button>
      </Link>
    </AuthCard>
  );
}
