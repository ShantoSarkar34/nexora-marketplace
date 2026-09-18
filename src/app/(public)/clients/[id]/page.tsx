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
import { getInitials } from "@/lib/get-initials";
import { useAuth } from "@/hooks/use-auth";

export default function ClientPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: profile, isLoading, isError } = useQuery({
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

  console.log(profile)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
       <Card>
        <div className="border-brand-500/30 flex items-center gap-4 border-b pb-4">
         <div className="bg-client-500/10 text-client-500 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={profile.companyName}
                className="border-brand-600/70 rounded-full border-2 object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-client-500/10 text-xl font-semibold text-client-500">
                {getInitials(profile.companyName)}
              </span>
            )}
          </div>
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

{/* Review  */}
      <Card className="mt-6">
        <h3>Reviews</h3>
        <div className="mt-4">
          <ReviewList userId={params.id} />
        </div>
      </Card>

      {profile.about && (
        <Card className="mt-6">
          <h3>About</h3>
          <p className="mt-3 text-sm text-text-secondary">{profile.about}</p>
        </Card>
      )}
    </div>
  );
}