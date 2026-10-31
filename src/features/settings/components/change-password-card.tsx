"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/shared/password-input";
import { ApiError } from "@/lib/api-client";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import { useChangePassword } from "@/hooks/use-auth-mutations";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/settings/schemas";
import type { AuthUser } from "@/types/user";

export function ChangePasswordCard({ user }: { user: AuthUser }) {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Google-only accounts have no Nexora password to change.
  if (user.provider !== "LOCAL") {
    return (
      <Card>
        <h3>Password</h3>
        <p className="text-text-secondary mt-2 text-sm">
          You signed in with Google, so your account doesn&apos;t have a Nexora
          password. Manage your sign-in from your Google account instead.
        </p>
      </Card>
    );
  }

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password updated. Your other devices were signed out.");
      reset();
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        applyApiFieldErrors(setError, error.errors);
      }
      // Everything else (wrong current password, rate limit) is toasted globally.
    }
  }

  return (
    <Card>
      <h3>Change password</h3>
      <p className="text-text-secondary mt-1 text-sm">
        You&apos;ll stay signed in here. Other devices will be signed out.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="currentPassword">Current password</Label>
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-status-error mt-1 text-xs">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="newPassword">New password</Label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-status-error mt-1 text-xs">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="confirmNewPassword">Confirm new password</Label>
          <PasswordInput
            id="confirmNewPassword"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-status-error mt-1 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" size="sm" isLoading={changePassword.isPending}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
