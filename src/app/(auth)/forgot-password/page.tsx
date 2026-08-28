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
import { useForgotPassword } from "@/hooks/use-auth-mutations";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await forgotPassword.mutateAsync(values.email);
      setSubmitted(true);
    } catch {
      // toasted globally
    }
  }

  if (submitted) {
    return (
      <AuthCard title="Check your email">
        <Alert variant="success">
          If an account exists with that email, we&apos;ve sent a link to reset
          your password.
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
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
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
        <Button
          type="submit"
          className="w-full"
          isLoading={forgotPassword.isPending}
        >
          Send reset link
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
