"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/shared/password-input";
import { ApiError } from "@/lib/api-client";
import { useDeleteAccount } from "@/hooks/use-auth-mutations";
import {
  deleteAccountSchema,
  type DeleteAccountFormValues,
} from "@/features/settings/schemas";
import type { AuthUser } from "@/types/user";

export function DeleteAccountCard({ user }: { user: AuthUser }) {
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const [open, setOpen] = useState(false);
  // The 409 "you still have contracts in progress" message, shown in the dialog.
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  const usesPassword = user.provider === "LOCAL";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      setBlockedMessage(null);
    }
  }

  async function onSubmit(values: DeleteAccountFormValues) {
    setBlockedMessage(null);

    if (!usesPassword) {
      const typed = values.confirmation.trim().toLowerCase();
      if (typed !== user.email.toLowerCase()) {
        setError("confirmation", {
          type: "validate",
          message: "That doesn't match your account email.",
        });
        return;
      }
    }

    try {
      await deleteAccount.mutateAsync(
        usesPassword
          ? { password: values.confirmation }
          : { confirmEmail: values.confirmation.trim() },
      );
      toast.success("Your account has been deleted.");
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setBlockedMessage(error.message);
        return;
      }
      if (error instanceof ApiError && error.errors) {
        const message =
          error.errors.password?.[0] ??
          error.errors.confirmEmail?.[0] ??
          error.errors._form?.[0];
        if (message) setError("confirmation", { type: "server", message });
      }
      // Anything else (wrong password, rate limit) is toasted globally.
    }
  }

  return (
    <Card className="border-status-error/30">
      <h3 className="text-status-error">Delete account</h3>
      <p className="text-text-secondary mt-2 text-sm">
        Permanently delete your account. You can&apos;t delete it while you have
        contracts that are pending, active, submitted, or disputed. Your past
        contracts and reviews stay on record, shown as &quot;Deleted user&quot;.
      </p>
      <Button
        variant="destructive"
        size="sm"
        className="mt-4"
        onClick={() => setOpen(true)}
      >
        Delete my account
      </Button>

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Delete your account"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {blockedMessage && <Alert variant="warning">{blockedMessage}</Alert>}

          <p className="text-text-secondary text-sm">
            This can&apos;t be undone. You&apos;ll be signed out right away.
          </p>

          <div>
            <Label htmlFor="deleteConfirmation">
              {usesPassword
                ? "Enter your password to confirm"
                : "Type your account email to confirm"}
            </Label>
            {usesPassword ? (
              <PasswordInput
                id="deleteConfirmation"
                autoComplete="current-password"
                {...register("confirmation")}
              />
            ) : (
              <Input
                id="deleteConfirmation"
                type="email"
                placeholder={user.email}
                {...register("confirmation")}
              />
            )}
            {errors.confirmation && (
              <p className="text-status-error mt-1 text-xs">
                {errors.confirmation.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="destructive"
              isLoading={deleteAccount.isPending}
            >
              Delete account
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
