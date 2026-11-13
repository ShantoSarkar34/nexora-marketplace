import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { MatchBadge } from "@/features/jobs/components/match-badge";
import { formatBudget } from "@/features/jobs/utils";
import type { RecommendedJob } from "@/types/job";

const MAX_CHIPS = 3;

// A compact version of a job card, for the dashboard.
export function RecommendedJobRow({ item }: { item: RecommendedJob }) {
  const { job, match } = item;
  const poster = job.companyName || job.clientName;
  const extra = match.matchedSkills.length - MAX_CHIPS;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="border-border hover:bg-surface-muted block rounded-md border p-3 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-text-primary truncate text-sm font-medium">
            {job.title}
          </p>
          <p className="text-text-secondary truncate text-xs">
            {poster ? `${poster} · ` : ""}
            {formatBudget(job)}
          </p>
        </div>
        <MatchBadge score={match.score} />
      </div>

      {match.matchedSkills.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {match.matchedSkills.slice(0, MAX_CHIPS).map((skill) => (
            <Badge key={skill} variant="success">
              {skill}
            </Badge>
          ))}
          {extra > 0 && (
            <span className="text-text-secondary text-xs">+{extra} more</span>
          )}
        </div>
      )}
    </Link>
  );
}
