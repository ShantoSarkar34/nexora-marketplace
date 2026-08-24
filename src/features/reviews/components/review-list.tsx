import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Review } from "@/types/review";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-text-secondary text-sm">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-border border-b pb-4 last:border-0 last:pb-0"
        >
          <div className="flex items-center justify-between">
            <p className="text-text-primary text-sm font-medium">
              {review.authorName}
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3.5 w-3.5",
                    review.rating >= star
                      ? "fill-status-pending text-status-pending"
                      : "text-border",
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-text-secondary mt-1 text-sm">{review.comment}</p>
          <p className="text-text-secondary mt-1 text-xs">{review.createdAt}</p>
        </div>
      ))}
    </div>
  );
}
