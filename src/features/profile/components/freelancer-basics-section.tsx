"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera } from "lucide-react";

import { EditableSection } from "@/features/profile/components/editable-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUploadDialog } from "@/features/profile/components/avatar-upload-dialog";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import { ApiError } from "@/lib/api-client";
import { useUpdateFreelancerBasics } from "@/hooks/use-freelancer-profile";
import { useUpdateMe } from "@/hooks/use-auth-mutations";
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
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="bg-brand-100 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
                {getInitials(user.name)}
              </span>
            )}
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
      renderEdit={(close) => (
        <BasicsForm user={user} profile={profile} onDone={close} />
      )}
    />
  );
}

function BasicsForm({ user, profile, onDone }: Props & { onDone: () => void }) {
  const updateBasics = useUpdateFreelancerBasics();
  const updateMe = useUpdateMe();
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FreelancerBasicsInput, unknown, FreelancerBasicsValues>({
    resolver: zodResolver(freelancerBasicsSchema),
    defaultValues: {
      name: user.name,
      title: profile.title,
      bio: profile.bio,
      hourlyRate: profile.hourlyRate,
    },
  });

  async function onSubmit(values: FreelancerBasicsValues) {
    try {
      await Promise.all([
        updateMe.mutateAsync({ name: values.name }),
        updateBasics.mutateAsync({
          title: values.title,
          bio: values.bio,
          hourlyRate: values.hourlyRate,
        }),
      ]);
      toast.success("Profile updated");
      onDone();
    } catch (error) {
      if (error instanceof ApiError && error.errors)
        applyApiFieldErrors(setError, error.errors);
    }
  }

  const isSubmitting = updateBasics.isPending || updateMe.isPending;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Profile photo</Label>
          <div className="mt-1.5 flex items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="bg-brand-100 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
                {getInitials(user.name)}
              </span>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setAvatarDialogOpen(true)}
            >
              <Camera className="mr-1.5 h-3.5 w-3.5" />
              Change photo
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-status-error mt-1 text-xs">
              {errors.name.message}
            </p>
          )}
        </div>
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
            <p className="text-status-error mt-1 text-xs">
              {errors.bio.message}
            </p>
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
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Save changes
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>

      <AvatarUploadDialog
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
      />
    </>
  );
}
