"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { JobCard } from "@/features/jobs/components/job-card";
import { RecommendedEmptyState } from "@/features/recommendations/components/recommended-empty-state";
import { useRecommendedJobs } from "@/hooks/use-recommended-jobs";

const FEED_SIZE = 30;

export function RecommendedJobsFeed() {
  const feed = useRecommendedJobs(FEED_SIZE);
  const items = feed.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1>Matched for you</h1>
        <p className="text-text-secondary mt-1">
          Open jobs that line up with your skills, best match first.
        </p>
      </div>

      {feed.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : feed.isError ? (
        <div className="border-border bg-surface rounded-md border px-6 py-12 text-center">
          <p className="text-text-primary font-medium">
            We couldn&apos;t load your matches.
          </p>
          <p className="text-text-secondary mt-2 text-sm">
            Please try again in a moment.
          </p>
          <Button className="mt-5" onClick={() => feed.refetch()}>
            Try again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <RecommendedEmptyState reason={feed.data?.reason} />
      ) : (
        <>
          <p className="text-text-secondary text-sm">
            {items.length} {items.length === 1 ? "job matches" : "jobs match"}{" "}
            your profile. Scores compare the skills on your profile with each
            job&apos;s requirements. Open a job and run Deep Analysis for a
            detailed breakdown.
          </p>
          <div className="space-y-4">
            {items.map((item) => (
              <JobCard key={item.job.id} job={item.job} match={item.match} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
