"use client";

import { Card } from "@/components/ui/card";
import { RatingSummary } from "@/features/reviews/components/rating-summary";
import { ReviewList } from "@/features/reviews/components/review-list";

export function ProfileReviewsSection({ userId }: { userId: string }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3>Reviews</h3>
        <RatingSummary userId={userId} />
      </div>
      <div className="mt-4">
        <ReviewList userId={userId} />
      </div>
    </Card>
  );
}