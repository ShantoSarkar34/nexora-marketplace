import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { FreelancerListItem } from "@/services/profile";

export function FeaturedTalentCard({
  freelancer,
}: {
  freelancer: FreelancerListItem;
}) {
  const skills = freelancer.skills
    .map((item) => item.skill.name)
    .filter(Boolean);

  const hourlyRate = Number(freelancer.hourlyRate);
  const hasRate =
    freelancer.hourlyRate !== null &&
    Number.isFinite(hourlyRate) &&
    hourlyRate > 0;

  return (
    <article className="group border-border bg-surface hover:border-brand-500/40 flex h-full flex-col rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="flex items-start gap-4">
        <div className="bg-brand-500/10 relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
          {freelancer.user.imageUrl ? (
            <Image
              src={freelancer.user.imageUrl}
              alt={freelancer.user.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="text-brand-600 h-7 w-7" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-text-primary truncate font-semibold">
            {freelancer.user.name}
          </h3>
          <p className="text-text-secondary mt-1 line-clamp-2 text-sm leading-5">
            {freelancer.title || "Freelancer"}
          </p>
        </div>
      </div>

      <p className="text-text-secondary mt-5 line-clamp-3 min-h-18 text-sm leading-6">
        {freelancer.bio?.trim() ||
          "View this freelancer's profile to learn more about their work."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="neutral">
            {skill}
          </Badge>
        ))}

        {skills.length > 4 && (
          <span className="text-text-secondary self-center text-xs">
            +{skills.length - 4} more
          </span>
        )}

        {skills.length === 0 && (
          <span className="text-text-secondary text-xs">
            Skills not added yet
          </span>
        )}
      </div>

      <div className="border-border mt-auto flex items-center justify-between gap-3 border-t pt-5">
        <div>
          <p className="text-text-secondary text-xs">Hourly rate</p>
          <p className="text-text-primary mt-1 font-semibold">
            {hasRate ? `$${hourlyRate.toFixed(2)}/hr` : "Not specified"}
          </p>
        </div>

        <Link
          href={`/freelancers/${freelancer.userId}`}
          className="bg-brand-600 hover:bg-brand-600/90 inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white transition-colors"
        >
          View profile
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="text-text-secondary mt-3 flex items-center gap-1.5 text-xs">
        <BriefcaseBusiness className="h-3.5 w-3.5" />
        {skills.length} {skills.length === 1 ? "skill" : "skills"} listed
      </div>
    </article>
  );
}
