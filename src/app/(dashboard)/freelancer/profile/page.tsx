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
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { CreateProfilePrompt } from "@/features/profile/components/create-profile-prompt";
import { FreelancerBasicsSection } from "@/features/profile/components/freelancer-basics-section";
import { SkillsSection } from "@/features/profile/components/skills-section";
import { ExperienceSection } from "@/features/profile/components/experience-section";
import { PortfolioSection } from "@/features/profile/components/portfolio-section";
import { useAuth } from "@/hooks/use-auth";
import {
  useCreateFreelancerProfile,
  useFreelancerProfile,
} from "@/hooks/use-freelancer-profile";
import {
  freelancerBasicsSchema,
  type FreelancerBasicsInput,
  type FreelancerBasicsValues,
} from "@/features/profile/schemas";

export default function FreelancerProfilePage() {
  const { user } = useAuth();
  const { profile, isLoading, notFound } = useFreelancerProfile();
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
      <CreateProfileForm />
    ) : (
      <CreateProfilePrompt
        title="Set up your profile"
        description="Add your title, bio, and rate so clients can find and evaluate you."
        actionLabel="Create profile"
        onCreate={() => setCreating(true)}
        isLoading={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>My Profile</h1>
        <p className="text-text-secondary mt-1">
          This is how clients see you when reviewing applications.
        </p>
      </div>

      <ProfileCompletionCard percentage={profile.completionPercentage} />

      {user && <FreelancerBasicsSection user={user} profile={profile} />}
      <SkillsSection skills={profile.skills} />
      <ExperienceSection experience={profile.experience} />
      <PortfolioSection portfolio={profile.portfolio} />
    </div>
  );
}

function CreateProfileForm() {
  const createProfile = useCreateFreelancerProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FreelancerBasicsInput, unknown, FreelancerBasicsValues>({
    resolver: zodResolver(freelancerBasicsSchema),
  });

  async function onSubmit(values: FreelancerBasicsValues) {
    try {
      await createProfile.mutateAsync(values);
      toast.success("Profile created");
    } catch {
      // toasted globally
    }
  }

  return (
    <Card>
      <h3>Create your profile</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="title">Professional title</Label>
          <Input
            id="title"
            placeholder="e.g. Full-Stack Developer"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-status-error mt-1 text-xs">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="Tell clients about your experience..."
            {...register("bio")}
          />
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
        <Button type="submit" isLoading={createProfile.isPending}>
          Create Profile
        </Button>
      </form>
    </Card>
  );
}
