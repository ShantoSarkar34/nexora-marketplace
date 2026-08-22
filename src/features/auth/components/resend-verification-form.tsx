"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { AuthCard } from "@/components/shared/auth-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from "@/features/auth/schemas";

export function ResendVerificationForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
  });

  async function onSubmit(values: ResendVerificationFormValues) {
    // Track B: replace with real API call -> services/auth.ts:resendVerification(values)
    console.log("Resend verification (mock):", values);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AuthCard title="Verification email sent">
        <Alert variant="success">
          If an account exists with that email, we&apos;ve sent a new
          verification link.
        </Alert>
        <Link
          href="/login"
          className="mt-6 flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Resend verification email"
      description="Enter your email and we'll send a new verification link."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-status-error mt-1 text-xs">
              {errors.email.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Resend email
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to login
      </Link>
    </AuthCard>
  );
}
