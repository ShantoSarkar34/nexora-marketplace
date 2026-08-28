"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AuthCard } from "@/components/shared/auth-card";
import { RoleSelector } from "@/features/auth/components/role-selector";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "@/components/shared/google-sign-in-button";
import { useGoogleLogin, useRegister } from "@/hooks/use-auth-mutations";
import { ApiError } from "@/lib/api-client";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import {
  registerSchema,
  type RegisterFormValues,
  type UserRole,
} from "@/features/auth/schemas";
import { env } from "@/lib/env";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: UserRole =
    searchParams.get("role") === "client" ? "CLIENT" : "FREELANCER";

  const registerMutation = useRegister();
  const googleMutation = useGoogleLogin();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: initialRole, agreeToTerms: false },
  });

  const role = watch("role");

  console.log(env.NEXT_PUBLIC_API_URL,env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerMutation.mutateAsync({
        name: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      toast.success("Account created — log in to continue.");
      router.push(`/login?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        applyApiFieldErrors(setError, error.errors);
      }
      // Other failures (e.g. 409 duplicate email) are already toasted
      // globally by the mutation cache in query-provider.
    }
  }

  async function handleGoogleToken(idToken: string) {
    try {
      const user = await googleMutation.mutateAsync({ idToken, role });
      toast.success(`Welcome, ${user.name}`);
      router.push(
        user.role === "CLIENT" ? "/client/dashboard" : "/freelancer/dashboard",
      );
    } catch {
      // toasted globally
    }
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

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting || registerMutation.isPending}
        >
          Create account
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
        Already have an account?{" "}
        <Link href="/login" className="font-medium">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
