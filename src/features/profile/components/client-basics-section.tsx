"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Globe, MapPin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { EditableSection } from "@/features/profile/components/editable-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUploadDialog } from "@/features/profile/components/avatar-upload-dialog";
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
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="bg-client-500/10 text-client-500 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
                {getInitials(user.name)}
              </span>
            )}
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
            {profile.foundedYear && <span>Founded {profile.foundedYear}</span>}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm">
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
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 flex items-center gap-1.5"
              >
                <FaLinkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            )}
            {profile.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 flex items-center gap-1.5"
              >
                <FaXTwitter className="h-3.5 w-3.5" />
                Twitter
              </a>
            )}
          </div>
        </div>
      )}
      renderEdit={(close) => (
        <ClientBasicsForm user={user} profile={profile} onDone={close} />
      )}
    />
  );
}

function ClientBasicsForm({
  user,
  profile,
  onDone,
}: Props & { onDone: () => void }) {
  const updateBasics = useUpdateClientBasics();
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

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
      location: profile.location ?? "",
      foundedYear: profile.foundedYear,
      linkedinUrl: profile.linkedinUrl ?? "",
      twitterUrl: profile.twitterUrl ?? "",
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Company photo</Label>
          <div className="mt-1.5 flex items-center gap-3">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="bg-client-500/10 text-client-500 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="companySize">Company size</Label>
            <Input
              id="companySize"
              placeholder="e.g. 11-50"
              {...register("companySize")}
            />
          </div>
          <div>
            <Label htmlFor="foundedYear">Founded year</Label>
            <Input
              id="foundedYear"
              type="number"
              placeholder="e.g. 2019"
              {...register("foundedYear")}
            />
            {errors.foundedYear && (
              <p className="text-status-error mt-1 text-xs">
                {errors.foundedYear.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco, USA"
              {...register("location")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <div>
            <Label htmlFor="linkedinUrl">LinkedIn</Label>
            <Input
              id="linkedinUrl"
              placeholder="https://linkedin.com/..."
              {...register("linkedinUrl")}
            />
            {errors.linkedinUrl && (
              <p className="text-status-error mt-1 text-xs">
                {errors.linkedinUrl.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="twitterUrl">Twitter / X</Label>
            <Input
              id="twitterUrl"
              placeholder="https://x.com/..."
              {...register("twitterUrl")}
            />
            {errors.twitterUrl && (
              <p className="text-status-error mt-1 text-xs">
                {errors.twitterUrl.message}
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

      <AvatarUploadDialog
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
      />
    </>
  );
}
