"use client";

import { useParams, notFound } from "next/navigation";
import { Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { clientProfileService } from "@/services/profile";
import { RatingSummary } from "@/features/reviews/components/rating-summary";
import { useAuth } from "@/hooks/use-auth";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ClientPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-12">
      <Card>
        <div className="border-brand-500/40 flex items-center gap-4 border-b pb-4">
          <span className="bg-client-500/10 text-client-500 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
            <img
              src={user?.imageUrl}
              alt={user?.name}
              className="border-brand-600/70 rounded-full border-2 object-cover"
            />
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
          <p className="text-text-secondary mt-4 text-sm">{profile.about}</p>
        )}
        {profile.website && (
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600/90 flex items-center gap-1.5"
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
                className="text-brand-600/90 flex items-center gap-1.5"
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
                className="text-brand-600/90 flex items-center gap-1.5"
              >
                <FaXTwitter className="h-3.5 w-3.5" />
                Twitter
              </a>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
