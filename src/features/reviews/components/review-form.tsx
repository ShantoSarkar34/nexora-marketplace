"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  targetName: string;
  onSubmit: () => void;
}

export function ReviewForm({ targetName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0 || !comment.trim()) return;
    setIsSubmitting(true);
    // Track B: replace with real API call -> services/reviews.ts:createReview({ rating, comment })
    console.log("Review (mock):", { targetName, rating, comment });
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    onSubmit();
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
        placeholder={`Share your experience working with ${targetName}...`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        isLoading={isSubmitting}
        disabled={rating === 0}
      >
        Submit Review
      </Button>
    </div>
  );
}
