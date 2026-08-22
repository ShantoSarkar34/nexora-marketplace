"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "@/components/shared/auth-card";
import { RoleSelector } from "@/features/auth/components/role-selector";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  registerSchema,
  type RegisterFormValues,
  type UserRole,
} from "@/features/auth/schemas";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole: UserRole =
    searchParams.get("role") === "client" ? "CLIENT" : "FREELANCER";

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: initialRole, agreeToTerms: false },
  });

  const role = watch("role");

  async function onSubmit(values: RegisterFormValues) {
    // Track B: replace with real API call -> services/auth.ts:register(values)
    console.log("Register (mock):", values);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AuthCard title="Check your email">
        <Alert variant="success">
          We&apos;ve sent a verification link to your email address. Click it to
          activate your account.
        </Alert>
        <p className="text-text-secondary mt-4 text-sm">
          Didn&apos;t get it?{" "}
          <Link href="/resend-verification" className="font-medium">
            Resend verification email
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join Nexora as a freelancer or a client."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>I am a...</Label>
          <RoleSelector
            value={role}
            onChange={(next) =>
              setValue("role", next, { shouldValidate: true })
            }
          />
        </div>

        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Jane Doe"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-status-error mt-1 text-xs">
              {errors.fullName.message}
            </p>
          )}
        </div>

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

        <div>
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm password</Label>
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

        <div>
          <label className="text-text-secondary flex items-start gap-2 text-sm">
            <Checkbox {...register("agreeToTerms")} className="mt-0.5" />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-status-error mt-1 text-xs">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="text-text-secondary mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-medium">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
