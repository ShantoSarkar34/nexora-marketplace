import { MapPin, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockFreelancerProfile } from "@/lib/mock-data/profiles";

export default async function FreelancerPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Track B: replace with GET /freelancers/:id — `params.id` unused until then
  await params;
  const profile = mockFreelancerProfile;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700">
              {profile.avatarInitials}
            </span>
            <div>
              <h1 className="text-xl">{profile.name}</h1>
              <p className="text-sm text-text-secondary">{profile.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-text-primary">
              ${profile.hourlyRate}/hr
            </p>
            <div className="mt-1 flex items-center justify-end gap-1 text-sm text-text-secondary">
              <Star className="h-3.5 w-3.5 fill-status-pending text-status-pending" />
              4.9 (24 reviews)
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-text-secondary">{profile.bio}</p>
        <Button className="mt-6">Contact / Invite to Job</Button>
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
            <div key={exp.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-text-primary">{exp.title}</p>
              <p className="text-xs text-text-secondary">
                {exp.company} · {exp.startDate} – {exp.endDate ?? "Present"}
              </p>
              <p className="mt-1.5 text-sm text-text-secondary">{exp.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h3>Portfolio</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profile.portfolio.map((item) => (
            <div key={item.id} className="rounded-md border border-border p-4">
              <p className="text-sm font-medium text-text-primary">{item.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}