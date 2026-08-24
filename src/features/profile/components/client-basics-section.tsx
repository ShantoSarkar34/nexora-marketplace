"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, MapPin } from "lucide-react";

import { EditableSection } from "@/features/profile/components/editable-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  clientBasicsSchema,
  type ClientBasicsInput,
  type ClientBasicsValues,
} from "@/features/profile/schemas";
import type { ClientProfile } from "@/types/profile";

interface Props {
  profile: ClientProfile;
  onSave: (values: ClientBasicsValues) => void;
}

export function ClientBasicsSection({ profile, onSave }: Props) {
  return (
    <EditableSection
      title="Company Information"
      renderView={() => (
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-client-500/10 text-client-500 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
              {profile.avatarInitials}
            </span>
            <div>
              <p className="text-text-primary font-semibold">
                {profile.companyName}
              </p>
              <p className="text-text-secondary text-sm">
                {profile.name} · {profile.industry}
              </p>
            </div>
          </div>
          <p className="text-text-secondary mt-4 text-sm">
            {profile.companyDescription}
          </p>
          <div className="text-text-secondary mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </span>
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 flex items-center gap-1.5"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
          </div>
        </div>
      )}
      renderEdit={(close) => (
        <ClientBasicsForm profile={profile} onSave={onSave} onDone={close} />
      )}
    />
  );
}

function ClientBasicsForm({
  profile,
  onSave,
  onDone,
}: Props & { onDone: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientBasicsInput, unknown, ClientBasicsValues>({
    resolver: zodResolver(clientBasicsSchema),
    defaultValues: {
      name: profile.name,
      companyName: profile.companyName,
      companyDescription: profile.companyDescription,
      industry: profile.industry,
      location: profile.location,
      website: profile.website ?? "",
    },
  });

  async function onSubmit(values: ClientBasicsValues) {
    setIsSubmitting(true);
    // Track B: replace with real API call -> services/profile.ts:updateClientBasics(values)
    await new Promise((resolve) => setTimeout(resolve, 700));
    onSave(values);
    setIsSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-status-error mt-1 text-xs">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" {...register("companyName")} />
          {errors.companyName && (
            <p className="text-status-error mt-1 text-xs">
              {errors.companyName.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="companyDescription">Company description</Label>
        <Textarea
          id="companyDescription"
          rows={4}
          {...register("companyDescription")}
        />
        {errors.companyDescription && (
          <p className="text-status-error mt-1 text-xs">
            {errors.companyDescription.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" {...register("industry")} />
          {errors.industry && (
            <p className="text-status-error mt-1 text-xs">
              {errors.industry.message}
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
      <div>
        <Label htmlFor="website">Website (optional)</Label>
        <Input
          id="website"
          placeholder="https://..."
          {...register("website")}
        />
        {errors.website && (
          <p className="text-status-error mt-1 text-xs">
            {errors.website.message}
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
  );
}
