"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  ExternalLink,
  Globe,
  Star,
  UserRound,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ProfileMetaBadges } from "@/features/profile/components/profile-meta-badges";
import { RatingSummary } from "@/features/reviews/components/rating-summary";
import { ReviewList } from "@/features/reviews/components/review-list";
import { getInitials } from "@/lib/get-initials";
import { freelancerProfileService } from "@/services/profile";

// "2025-08" -> "Aug 2025"
function formatMonth(value: string) {
  if (!value) return "";
  return new Date(`${value}-01`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function FreelancerPublicProfilePage() {
  const params = useParams<{ id: string }>();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["freelancer-profile", "public", params.id],
    queryFn: () => freelancerProfileService.getPublic(params.id),
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex justify-center px-4 py-20">
        <div className="text-center">
          <UserRound className="text-text-secondary mx-auto h-10 w-10" />
          <h2 className="text-text-primary mt-4 text-lg font-semibold">
            Freelancer not found
          </h2>
          <p className="text-text-secondary mt-1 text-sm">
            This freelancer profile may no longer be available.
          </p>
        </div>
      </div>
    );
  }

  const name = profile.name || "Freelancer";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <Card className="overflow-hidden p-0">
        <div className="bg-brand-500/5 h-24 sm:h-32" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* Avatar: the profile owner's photo, never the viewer's */}
              <div className="bg-surface border-border relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow-sm sm:h-24 sm:w-24">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-freelancer-500/10 text-freelancer-500 flex h-full w-full items-center justify-center text-2xl font-semibold">
                    {getInitials(name)}
                  </div>
                )}
              </div>

              <div className="pb-1">
                <h1 className="text-text-primary text-xl font-semibold sm:text-2xl">
                  {name}
                </h1>

                <p className="text-text-secondary mt-1 text-sm sm:text-base">
                  {profile.title || "Freelancer"}
                </p>

                <div className="mt-2">
                  <ProfileMetaBadges
                    availability={profile.availability}
                    experienceLevel={profile.experienceLevel}
                  />
                </div>
              </div>
            </div>

            {/* Hourly rate */}
            <div className="pb-1">
              <p className="text-text-secondary text-xs">Hourly rate</p>
              <p className="text-text-primary mt-0.5 text-xl font-semibold">
                ${profile.hourlyRate}
                <span className="text-text-secondary text-sm font-normal">
                  /hr
                </span>
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <RatingSummary userId={params.id} />
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* About */}
          <Card>
            <div className="flex items-center gap-2">
              <UserRound className="text-brand-600 h-5 w-5" />
              <h2 className="text-text-primary text-lg font-semibold">About</h2>
            </div>

            <p className="text-text-secondary mt-4 text-sm leading-7">
              {profile.bio || "This freelancer hasn't added a bio yet."}
            </p>
          </Card>

          {/* Skills */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="text-brand-600 h-5 w-5" />
                <h2 className="text-text-primary text-lg font-semibold">
                  Skills
                </h2>
              </div>

              {profile.skills.length > 0 && (
                <span className="text-text-secondary text-xs">
                  {profile.skills.length} skills
                </span>
              )}
            </div>

            {profile.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill.id} variant="brand">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary mt-4 text-sm">
                No skills have been added yet.
              </p>
            )}
          </Card>

          {/* Experience */}
          <Card>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="text-brand-600 h-5 w-5" />
              <h2 className="text-text-primary text-lg font-semibold">
                Experience
              </h2>
            </div>

            {profile.experience.length > 0 ? (
              <div className="mt-5 space-y-6">
                {profile.experience.map((experience, index) => (
                  <div
                    key={experience.id}
                    className={`relative ${
                      index !== profile.experience.length - 1
                        ? "border-border border-l pl-5"
                        : "pl-5"
                    }`}
                  >
                    <div className="bg-brand-600 absolute top-1.5 -left-1.25 h-2.5 w-2.5 rounded-full" />

                    <h3 className="text-text-primary text-sm font-semibold">
                      {experience.title}
                    </h3>

                    <p className="text-text-secondary mt-1 text-xs">
                      {experience.company}
                    </p>

                    <p className="text-text-secondary mt-1 text-xs">
                      {formatMonth(experience.startDate)} –{" "}
                      {experience.isCurrent || !experience.endDate
                        ? "Present"
                        : formatMonth(experience.endDate)}
                    </p>

                    {experience.description && (
                      <p className="text-text-secondary mt-3 text-sm leading-6">
                        {experience.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-text-secondary mt-5 rounded-lg border border-dashed p-6 text-center text-sm">
                No professional experience has been added yet.
              </div>
            )}
          </Card>

          {/* Portfolio */}
          <Card>
            <div className="flex items-center gap-2">
              <Globe className="text-brand-600 h-5 w-5" />
              <h2 className="text-text-primary text-lg font-semibold">
                Portfolio
              </h2>
            </div>

            {profile.portfolio.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {profile.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="border-border overflow-hidden rounded-lg border"
                  >
                    {item.imageUrl ? (
                      <div className="bg-surface-muted aspect-video overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="bg-brand-500/5 text-brand-600 flex aspect-video items-center justify-center">
                        <BriefcaseBusiness className="h-8 w-8" />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-text-primary text-sm font-semibold">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-text-secondary mt-2 line-clamp-3 text-sm leading-6">
                          {item.description}
                        </p>
                      )}

                      {item.projectUrl && (
                        <a
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                        >
                          View Project
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-text-secondary mt-5 rounded-lg border border-dashed p-6 text-center text-sm">
                No portfolio projects have been added yet.
              </div>
            )}
          </Card>

          {/* Reviews */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-text-primary text-lg font-semibold">
                  Reviews
                </h2>
                <p className="text-text-secondary mt-1 text-xs">
                  Feedback from previous clients
                </p>
              </div>

              <RatingSummary userId={params.id} />
            </div>

            <div className="border-border mt-5 border-t pt-5">
              <ReviewList userId={params.id} />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <h2 className="text-text-primary text-base font-semibold">
              Profile Overview
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-text-secondary text-xs">
                  Profile completion
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="bg-surface-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          Math.max(profile.completionPercentage || 0, 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>

                  <span className="text-text-primary text-xs font-medium">
                    {profile.completionPercentage || 0}%
                  </span>
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <p className="text-text-secondary text-xs">
                  Professional title
                </p>
                <p className="text-text-primary mt-1 text-sm font-medium">
                  {profile.title || "Not provided"}
                </p>
              </div>

              <div className="border-border border-t pt-4">
                <p className="text-text-secondary text-xs">Hourly rate</p>
                <p className="text-text-primary mt-1 text-sm font-medium">
                  ${profile.hourlyRate || 0}/hr
                </p>
              </div>

              <div className="border-border border-t pt-4">
                <p className="text-text-secondary text-xs">Skills</p>
                <p className="text-text-primary mt-1 text-sm font-medium">
                  {profile.skills.length}
                </p>
              </div>

              <div className="border-border border-t pt-4">
                <p className="text-text-secondary text-xs">
                  Portfolio projects
                </p>
                <p className="text-text-primary mt-1 text-sm font-medium">
                  {profile.portfolio.length}
                </p>
              </div>

              <div className="border-border border-t pt-4">
                <p className="text-text-secondary text-xs">Experience</p>
                <p className="text-text-primary mt-1 text-sm font-medium">
                  {profile.experience.length}{" "}
                  {profile.experience.length === 1 ? "position" : "positions"}
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
