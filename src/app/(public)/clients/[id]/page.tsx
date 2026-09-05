"use client";

import { useParams, notFound } from "next/navigation";
import { Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { clientProfileService } from "@/services/profile";
import { getInitials } from "@/lib/get-initials";
import { RatingSummary } from "@/features/reviews/components/rating-summary";

export default function ClientPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["client-profile", "public", params.id],
    queryFn: () => clientProfileService.getPublic(params.id),
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <div className="flex items-center gap-4">
          <span className="bg-client-500/10 text-client-500 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
            {getInitials(profile.name)}
          </span>
          <div>
            <h1 className="text-xl">{profile.companyName || profile.name}</h1>
            {profile.industry && (
              <p className="text-text-secondary text-sm">{profile.industry}</p>
            )}
            <div className="mt-1">
              <RatingSummary userId={params.id} />
            </div>
          </div>
        </div>
        {profile.about && (
          <p className="text-text-secondary mt-6 text-sm">{profile.about}</p>
        )}
        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 mt-4 flex items-center gap-1.5 text-sm"
          >
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
      </Card>
    </div>
  );
}
