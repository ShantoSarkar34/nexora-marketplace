"use client";

import { useParams, notFound } from "next/navigation";
import { Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { clientProfileService } from "@/services/profile";
import { getInitials } from "@/lib/get-initials";

export default function ClientPublicProfilePage() {
  const params = useParams<{ id: string }>();
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-client-500/10 text-xl font-semibold text-client-500">
            {getInitials(profile.name)}
          </span>
          <div>
            <h1 className="text-xl">{profile.companyName || profile.name}</h1>
            {profile.industry && <p className="text-sm text-text-secondary">{profile.industry}</p>}
          </div>
        </div>
        {profile.about && <p className="mt-6 text-sm text-text-secondary">{profile.about}</p>}
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-1.5 text-sm text-brand-600">
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
      </Card>
    </div>
  );
}