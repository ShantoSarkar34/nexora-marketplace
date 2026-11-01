"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Globe, MapPin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { RatingSummary } from "@/features/reviews/components/rating-summary";
import { ReviewList } from "@/features/reviews/components/review-list";
import { clientProfileService } from "@/services/profile";
import { companySizeLabels } from "@/types/enums";
import { getInitials } from "@/lib/get-initials";

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

  const displayName = profile.companyName || profile.name;
  const sizeLabel = profile.companySize
    ? (companySizeLabels[profile.companySize] ?? profile.companySize)
    : null;
  const hasMeta = !!(sizeLabel || profile.foundedYear || profile.location);
  const hasLinks = !!(
    profile.website ||
    profile.linkedinUrl ||
    profile.twitterUrl
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <div className="flex items-center gap-4">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={displayName}
              className="border-brand-600/70 h-16 w-16 shrink-0 rounded-full border-2 object-cover"
            />
          ) : (
            <span className="bg-client-500/10 text-client-500 flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold">
              {getInitials(displayName)}
            </span>
          )}
          <div>
            <h1 className="text-xl">{displayName}</h1>
            {profile.industry && (
              <p className="text-text-secondary text-sm">{profile.industry}</p>
            )}
            <div className="mt-1">
              <RatingSummary userId={params.id} />
            </div>
          </div>
        </div>

        {hasMeta && (
          <div className="text-text-secondary border-border mt-4 flex flex-wrap gap-4 border-t pt-4 text-sm">
            {sizeLabel && <span>Company size: {sizeLabel}</span>}
            {profile.foundedYear && <span>Founded {profile.foundedYear}</span>}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
            )}
          </div>
        )}

        {hasLinks && (
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

      <Card className="mt-6">
        <h3>Reviews</h3>
        <div className="mt-4">
          <ReviewList userId={params.id} />
        </div>
      </Card>

      {profile.about && (
        <Card className="mt-6">
          <h3>About</h3>
          <p className="text-text-secondary mt-3 text-sm">{profile.about}</p>
        </Card>
      )}
    </div>
  );
}
