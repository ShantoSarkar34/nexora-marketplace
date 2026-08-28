"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AuthCard } from "@/components/shared/auth-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "@/components/shared/google-sign-in-button";
import { useGoogleLogin, useLogin } from "@/hooks/use-auth-mutations";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const googleMutation = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: searchParams.get("email") ?? "" },
  });

  function redirectAfterAuth(role: string) {
    router.push(
      role === "CLIENT" ? "/client/dashboard" : "/freelancer/dashboard",
    );
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      const user = await loginMutation.mutateAsync(values);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      redirectAfterAuth(user.role);
    } catch {
      // invalid credentials (401) toasted globally
    }
  }

  async function handleGoogleToken(idToken: string) {
    try {
      const user = await googleMutation.mutateAsync({ idToken });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      redirectAfterAuth(user.role);
    } catch {
      // toasted globally
    }
  }

  return (
    <AuthCard title="Welcome back" description="Log in to your Nexora account.">
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

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting || loginMutation.isPending}
        >
          Log in
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface text-text-secondary px-2">or</span>
        </div>
      </div>

      <GoogleSignInButton onToken={handleGoogleToken} />

      <p className="text-text-secondary mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
