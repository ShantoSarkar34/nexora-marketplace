"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";

import { EditableSection } from "@/features/profile/components/editable-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  freelancerBasicsSchema,
  type FreelancerBasicsInput,
  type FreelancerBasicsValues,
} from "@/features/profile/schemas";
import type { FreelancerProfile } from "@/types/profile";

interface Props {
  profile: FreelancerProfile;
  onSave: (values: FreelancerBasicsValues) => void;
}

export function FreelancerBasicsSection({ profile, onSave }: Props) {
  return (
    <EditableSection
      title="About"
      renderView={() => (
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-brand-100 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
              {profile.avatarInitials}
            </span>
            <div>
              <p className="text-text-primary font-semibold">{profile.name}</p>
              <p className="text-text-secondary text-sm">{profile.title}</p>
            </div>
          </div>
          <p className="text-text-secondary mt-4 text-sm">{profile.bio}</p>
          <div className="text-text-secondary mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </span>
            <span className="text-text-primary font-medium">
              ${profile.hourlyRate}/hr
            </span>
          </div>
        </div>
      )}
      renderEdit={(close) => (
        <BasicsForm profile={profile} onSave={onSave} onDone={close} />
      )}
    />
  );
}

function BasicsForm({
  profile,
  onSave,
  onDone,
}: Props & { onDone: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FreelancerBasicsInput, unknown, FreelancerBasicsValues>({
    resolver: zodResolver(freelancerBasicsSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      hourlyRate: profile.hourlyRate,
      location: profile.location,
    },
  });

  async function onSubmit(values: FreelancerBasicsValues) {
    setIsSubmitting(true);
    // Track B: replace with real API call -> services/profile.ts:updateFreelancerBasics(values)
    await new Promise((resolve) => setTimeout(resolve, 700));
    onSave(values);
    setIsSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={4} {...register("bio")} />
        {errors.bio && (
          <p className="text-status-error mt-1 text-xs">{errors.bio.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
          <Input id="hourlyRate" type="number" {...register("hourlyRate")} />
          {errors.hourlyRate && (
            <p className="text-status-error mt-1 text-xs">
              {errors.hourlyRate.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && (
            <p className="text-status-error mt-1 text-xs">
              {errors.location.message}
            </p>
          )}
        </div>
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
  );
}
