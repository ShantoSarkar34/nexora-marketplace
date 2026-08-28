"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "@/components/shared/auth-card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useResetPassword } from "@/hooks/use-auth-mutations";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [submitted, setSubmitted] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;
    try {
      await resetPassword.mutateAsync({ token, newPassword: values.password });
      setSubmitted(true);
    } catch {
      // toasted globally
    }
  }

  if (!token) {
    return (
      <AuthCard title="Invalid reset link">
        <Alert variant="error">
          This password reset link is invalid or has expired.
        </Alert>
        <Link href="/forgot-password" className="mt-6 block">
          <Button className="w-full">Request a new link</Button>
        </Link>
      </AuthCard>
    );
  }

  if (submitted) {
    return (
      <AuthCard title="Password reset">
        <Alert variant="success">
          Your password has been updated. You can now log in with your new
          password.
        </Alert>
        <Link href="/login" className="mt-6 block">
          <Button className="w-full">Continue to login</Button>
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set a new password"
      description="Choose a strong password you haven't used before."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            placeholder="At least 8 characters"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-status-error mt-1 text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-status-error mt-1 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          isLoading={resetPassword.isPending}
        >
          Reset password
        </Button>
      </form>
    </AuthCard>
  );
}
