"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import { useSubmitReview } from "@/hooks/use-reviews";

interface ReviewFormProps {
  contractId: string;
  targetName: string;
  onSubmitted: () => void;
}

export function ReviewForm({
  contractId,
  targetName,
  onSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const submitReview = useSubmitReview();

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    try {
      await submitReview.mutateAsync({
        contractId,
        values: { rating, comment: comment.trim() || undefined },
      });
      toast.success("Review submitted — thank you!");
      onSubmitted();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.info("You've already reviewed this contract.");
        onSubmitted();
      }
      // other errors toasted globally
    }
  }

  return (
    <div className="mt-3 space-y-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                (hoverRating || rating) >= star
                  ? "fill-status-pending text-status-pending"
                  : "text-border",
              )}
            />
          </button>
        ))}
      </div>
      <Textarea
        rows={3}
        placeholder={`Share your experience working with ${targetName} (optional)...`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
      />
      <Button
        onClick={handleSubmit}
        isLoading={submitReview.isPending}
        disabled={rating === 0}
      >
        Submit Review
      </Button>
    </div>
  );
}
