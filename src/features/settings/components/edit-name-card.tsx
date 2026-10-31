"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import { useUpdateMe } from "@/hooks/use-auth-mutations";
import {
  updateNameSchema,
  type UpdateNameFormValues,
} from "@/features/settings/schemas";
import type { AuthUser } from "@/types/user";

export function EditNameCard({ user }: { user: AuthUser }) {
  const updateMe = useUpdateMe();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name },
  });

  // After a save the user refetches; re-sync the field and clear "dirty".
  useEffect(() => {
    reset({ name: user.name });
  }, [user.name, reset]);

  async function onSubmit(values: UpdateNameFormValues) {
    try {
      await updateMe.mutateAsync({ name: values.name });
      toast.success("Name updated");
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        applyApiFieldErrors(setError, error.errors);
      }
    }
  }

  return (
    <Card>
      <h3>Your name</h3>
      <p className="text-text-secondary mt-1 text-sm">
        This is the name other people see on your profile, applications, and
        contracts.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="settings-name">Full name</Label>
          <Input id="settings-name" {...register("name")} />
          {errors.name && (
            <p className="text-status-error mt-1 text-xs">
              {errors.name.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="sm"
          isLoading={updateMe.isPending}
          disabled={!isDirty}
        >
          Save name
        </Button>
      </form>
    </Card>
  );
}
