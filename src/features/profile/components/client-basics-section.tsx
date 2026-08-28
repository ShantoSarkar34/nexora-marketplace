"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Globe } from "lucide-react";

import { EditableSection } from "@/features/profile/components/editable-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import { ApiError } from "@/lib/api-client";
import { useUpdateClientBasics } from "@/hooks/use-client-profile";
import {
  clientBasicsSchema,
  type ClientBasicsInput,
  type ClientBasicsValues,
} from "@/features/profile/schemas";
import type { AuthUser } from "@/types/user";
import type { ClientProfile } from "@/types/profile";
import { getInitials } from "@/lib/get-initials";

interface Props {
  user: AuthUser;
  profile: ClientProfile;
}

export function ClientBasicsSection({ user, profile }: Props) {
  return (
    <EditableSection
      title="Company Information"
      renderView={() => (
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-client-500/10 text-client-500 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
              {getInitials(user.name)}
            </span>
            <div>
              <p className="text-text-primary font-semibold">
                {profile.companyName || user.name}
              </p>
              <p className="text-text-secondary text-sm">
                {profile.industry || "Industry not set"}
              </p>
            </div>
          </div>
          {profile.about && (
            <p className="text-text-secondary mt-4 text-sm">{profile.about}</p>
          )}
          <div className="text-text-secondary mt-4 flex flex-wrap gap-4 text-sm">
            {profile.companySize && (
              <span>{profile.companySize} employees</span>
            )}
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
        <ClientBasicsForm profile={profile} onDone={close} />
      )}
    />
  );
}

function ClientBasicsForm({
  profile,
  onDone,
}: {
  profile: ClientProfile;
  onDone: () => void;
}) {
  const updateBasics = useUpdateClientBasics();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ClientBasicsInput, unknown, ClientBasicsValues>({
    resolver: zodResolver(clientBasicsSchema),
    defaultValues: {
      companyName: profile.companyName ?? "",
      industry: profile.industry ?? "",
      companySize: profile.companySize ?? "",
      website: profile.website ?? "",
      about: profile.about ?? "",
    },
  });

  async function onSubmit(values: ClientBasicsValues) {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" {...register("companyName")} />
          {errors.companyName && (
            <p className="text-status-error mt-1 text-xs">
              {errors.companyName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" {...register("industry")} />
          {errors.industry && (
            <p className="text-status-error mt-1 text-xs">
              {errors.industry.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="about">Company description</Label>
        <Textarea id="about" rows={4} {...register("about")} />
        {errors.about && (
          <p className="text-status-error mt-1 text-xs">
            {errors.about.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="companySize">Company size</Label>
          <Input
            id="companySize"
            placeholder="e.g. 11-50"
            {...register("companySize")}
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
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
