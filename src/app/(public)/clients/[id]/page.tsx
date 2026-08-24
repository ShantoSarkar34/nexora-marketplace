import { Globe, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { mockClientProfile } from "@/lib/mock-data/profiles";

export default async function ClientPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Track B: replace with GET /clients/:id
  await params;
  const profile = mockClientProfile;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <div className="flex items-center gap-4">
          <span className="bg-client-500/10 text-client-500 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
            {profile.avatarInitials}
          </span>
          <div>
            <h1 className="text-xl">{profile.companyName}</h1>
            <p className="text-text-secondary text-sm">{profile.industry}</p>
          </div>
        </div>
        <p className="text-text-secondary mt-6 text-sm">
          {profile.companyDescription}
        </p>
        <div className="text-text-secondary mt-6 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </span>
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
        </div>
      </Card>
    </div>
  );
}
