"use client";

import { useParams, notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ReviewList } from "@/features/reviews/components/review-list";
import { useQuery } from "@tanstack/react-query";
import { freelancerProfileService } from "@/services/profile";
import { getInitials } from "@/lib/get-initials";

export default function FreelancerPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["freelancer-profile", "public", params.id],
    queryFn: () => freelancerProfileService.getPublic(params.id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !profile) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-brand-100 text-brand-700 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
              {getInitials(profile.name)}
            </span>
            <div>
              <h1 className="text-xl">{profile.name}</h1>
              <p className="text-text-secondary text-sm">{profile.title}</p>
            </div>
          </div>
          <p className="text-text-primary text-lg font-semibold">
            ${profile.hourlyRate}/hr
          </p>
        </div>
        <p className="text-text-secondary mt-6 text-sm">{profile.bio}</p>
      </Card>

      <Card className="mt-6">
        <h3>Skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill.id} variant="brand">
              {skill.name}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h3>Experience</h3>
        <div className="mt-4 space-y-5">
          {profile.experience.map((exp) => (
            <div
              key={exp.id}
              className="border-border border-b pb-4 last:border-0 last:pb-0"
            >
              <p className="text-text-primary text-sm font-medium">
                {exp.title}
              </p>
              <p className="text-text-secondary text-xs">
                {exp.company} · {exp.startDate} –{" "}
                {exp.isCurrent ? "Present" : exp.endDate}
              </p>
              {exp.description && (
                <p className="text-text-secondary mt-1.5 text-sm">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h3>Portfolio</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profile.portfolio.map((item) => (
            <div key={item.id} className="border-border rounded-md border p-4">
              <p className="text-text-primary text-sm font-medium">
                {item.title}
              </p>
              {item.description && (
                <p className="text-text-secondary mt-1 text-sm">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h3>Reviews</h3>
        <div className="mt-4">
          {/* <ReviewList userId={params.id} /> */}

          <p className="text-center"> You need to fix this! </p>
        </div>
      </Card>
    </div>
  );
}
