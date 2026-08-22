"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "@/components/shared/auth-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";

export function LoginForm() {
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    // Track B: replace with real API call -> services/auth.ts:login(values)
    console.log("Login (mock):", values);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setShowDemoNotice(true);
  }

  return (
    <AuthCard title="Welcome back" description="Log in to your Nexora account.">
      {showDemoNotice && (
        <Alert variant="info" className="mb-5">
          This is a UI-only demo — login will connect to the real backend in
          Track B.
        </Alert>
      )}

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

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-status-error mt-1 text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="text-text-secondary flex items-center gap-2 text-sm">
          <Checkbox {...register("rememberMe")} />
          Remember me
        </label>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="text-text-secondary mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
