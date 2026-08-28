"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreateProfilePrompt } from "@/features/profile/components/create-profile-prompt";
import { ClientBasicsSection } from "@/features/profile/components/client-basics-section";
import { useAuth } from "@/hooks/use-auth";
import {
  useClientProfile,
  useCreateClientProfile,
} from "@/hooks/use-client-profile";
import {
  clientBasicsSchema,
  type ClientBasicsInput,
  type ClientBasicsValues,
} from "@/features/profile/schemas";

export default function ClientProfilePage() {
  const { user } = useAuth();
  const { profile, isLoading, notFound } = useClientProfile();
  const [creating, setCreating] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (notFound || !profile) {
    return creating ? (
      <CreateClientProfileForm />
    ) : (
      <CreateProfilePrompt
        title="Set up your company profile"
        description="Add your company details so freelancers know who they're working with."
        actionLabel="Create profile"
        onCreate={() => setCreating(true)}
        isLoading={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Company Profile</h1>
        <p className="text-text-secondary mt-1">
          This is how freelancers see your company when reviewing your jobs.
        </p>
      </div>
      {user && <ClientBasicsSection user={user} profile={profile} />}
    </div>
  );
}

function CreateClientProfileForm() {
  const createProfile = useCreateClientProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientBasicsInput, unknown, ClientBasicsValues>({
    resolver: zodResolver(clientBasicsSchema),
  });

  async function onSubmit(values: ClientBasicsValues) {
    try {
      await createProfile.mutateAsync(values);
      toast.success("Profile created");
    } catch {
      // toasted globally
    }
  }

  return (
    <Card>
      <h3>Create your company profile</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" {...register("companyName")} />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" {...register("industry")} />
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
        <Button type="submit" isLoading={createProfile.isPending}>
          Create Profile
        </Button>
      </form>
    </Card>
  );
}
