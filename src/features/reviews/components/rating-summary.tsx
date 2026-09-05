"use client";

import { Star } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { useUserReviewSummary } from "@/hooks/use-reviews";

export function RatingSummary({ userId }: { userId: string }) {
  const { data, isLoading } = useUserReviewSummary(userId);

  if (isLoading) return <Spinner className="h-4 w-4" />;
  if (!data || data.totalReviews === 0) {
    return <p className="text-text-secondary text-sm">No reviews yet</p>;
  }

  return (
    <div className="text-text-secondary flex items-center gap-1.5 text-sm">
      <Star className="fill-status-pending text-status-pending h-3.5 w-3.5" />
      <span className="text-text-primary font-medium">
        {data.averageRating.toFixed(1)}
      </span>
      <span>
        ({data.totalReviews} review{data.totalReviews === 1 ? "" : "s"})
      </span>
    </div>
  );
}
