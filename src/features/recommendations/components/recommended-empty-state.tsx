import { SearchX, Sparkles, UserPlus } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import type { RecommendedReason } from "@/types/job";

export function RecommendedEmptyState({
  reason,
}: {
  reason?: RecommendedReason;
}) {
  if (reason === "NO_PROFILE") {
    return (
      <EmptyState
        icon={<UserPlus className="h-6 w-6" />}
        title="Create your profile to get matched"
        description="We compare your skills with open jobs. Add your profile and your best matches will show up here."
        actionLabel="Create profile"
        actionHref="/freelancer/profile"
      />
    );
  }

  if (reason === "NO_SKILLS") {
    return (
      <EmptyState
        icon={<Sparkles className="h-6 w-6" />}
        title="Add your skills to get matches"
        description="Matches are based on the skills on your profile. Add a few and we'll find jobs that fit."
        actionLabel="Add skills"
        actionHref="/freelancer/profile"
      />
    );
  }

  // NO_MATCHES, or an empty list with no reason given.
  return (
    <EmptyState
      icon={<SearchX className="h-6 w-6" />}
      title="No strong matches right now"
      description="New jobs are posted all the time. Check back soon, or browse all open jobs."
      actionLabel="Browse jobs"
      actionHref="/freelancer/jobs"
    />
  );
}
