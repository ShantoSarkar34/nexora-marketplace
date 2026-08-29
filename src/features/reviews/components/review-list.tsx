"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { reviewsService } from "@/services/reviews";

export function ReviewList({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", "user", userId],
    queryFn: () => reviewsService.getForUser(userId, { limit: 10 }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const reviews = data?.reviews ?? [];

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
          {review.comment && (
            <p className="text-text-secondary mt-1 text-sm">{review.comment}</p>
          )}
          <p className="text-text-secondary mt-1 text-xs">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
