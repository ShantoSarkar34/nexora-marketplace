"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecommendedEmptyState } from "@/features/recommendations/components/recommended-empty-state";
import { RecommendedJobRow } from "@/features/recommendations/components/recommended-job-row";
import { useRecommendedJobs } from "@/hooks/use-recommended-jobs";

const PREVIEW_COUNT = 3;

export function RecommendedJobsPreview() {
  const feed = useRecommendedJobs(PREVIEW_COUNT);
  const items = feed.data?.items ?? [];

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-brand-600 h-4 w-4" />
          <h3>Jobs matched for you</h3>
        </div>
        {items.length > 0 && (
          <Link href="/freelancer/recommended" className="text-sm font-medium">
            See all
          </Link>
        )}
      </div>

      <div className="mt-4">
        {feed.isLoading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: PREVIEW_COUNT }).map((_, index) => (
              <div
                key={index}
                className="border-border space-y-2 rounded-md border p-3"
              >
                <div className="bg-surface-muted h-4 w-2/3 rounded" />
                <div className="bg-surface-muted h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : feed.isError ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-text-secondary text-sm">
              We couldn&apos;t load your matches.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => feed.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <RecommendedEmptyState reason={feed.data?.reason} />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <RecommendedJobRow key={item.job.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
