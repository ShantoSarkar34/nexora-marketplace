"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { EditableSection } from "@/features/profile/components/editable-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import { ApiError } from "@/lib/api-client";
import { useUpdateFreelancerBasics } from "@/hooks/use-freelancer-profile";
import {
  freelancerBasicsSchema,
  type FreelancerBasicsInput,
  type FreelancerBasicsValues,
} from "@/features/profile/schemas";
import type { AuthUser } from "@/types/user";
import type { FreelancerProfile } from "@/types/profile";
import { getInitials } from "@/lib/get-initials";

interface Props {
  user: AuthUser;
  profile: FreelancerProfile;
}

export function FreelancerBasicsSection({ user, profile }: Props) {
  return (
    <EditableSection
      title="About"
      renderView={() => (
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-brand-100 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
              {getInitials(user.name)}
            </span>
            <div>
              <p className="text-text-primary font-semibold">{user.name}</p>
              <p className="text-text-secondary text-sm">{profile.title}</p>
            </div>
          </div>
          <p className="text-text-secondary mt-4 text-sm">{profile.bio}</p>
          <p className="text-text-primary mt-4 text-sm font-medium">
            ${profile.hourlyRate}/hr
          </p>
        </div>
      )}
      renderEdit={(close) => <BasicsForm profile={profile} onDone={close} />}
    />
  );
}

function BasicsForm({
  profile,
  onDone,
}: {
  profile: FreelancerProfile;
  onDone: () => void;
}) {
  const updateBasics = useUpdateFreelancerBasics();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FreelancerBasicsInput, unknown, FreelancerBasicsValues>({
    resolver: zodResolver(freelancerBasicsSchema),
    defaultValues: {
      title: profile.title,
      bio: profile.bio,
      hourlyRate: profile.hourlyRate,
    },
  });

  async function onSubmit(values: FreelancerBasicsValues) {
    try {
      await updateBasics.mutateAsync(values);
      toast.success("Profile updated");
      onDone();
    } catch (error) {
      if (error instanceof ApiError && error.errors)
        applyApiFieldErrors(setError, error.errors);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Professional title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-status-error mt-1 text-xs">
            {errors.title.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={4} {...register("bio")} />
        {errors.bio && (
          <p className="text-status-error mt-1 text-xs">{errors.bio.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
        <Input id="hourlyRate" type="number" {...register("hourlyRate")} />
        {errors.hourlyRate && (
          <p className="text-status-error mt-1 text-xs">
            {errors.hourlyRate.message}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={updateBasics.isPending}>
          Save changes
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
