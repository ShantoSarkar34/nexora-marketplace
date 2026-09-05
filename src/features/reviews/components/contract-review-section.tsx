"use client";

import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ReviewForm } from "@/features/reviews/components/review-form";
import { useContractReviews } from "@/hooks/use-reviews";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  contractId: string;
  targetName: string;
}

export function ContractReviewSection({ contractId, targetName }: Props) {
  const { user } = useAuth();
  const { data: reviews, isLoading, refetch } = useContractReviews(contractId);

  if (isLoading) {
    return (
      <Card className="flex justify-center py-6">
        <Spinner className="h-6 w-6" />
      </Card>
    );
  }

  const myReview = reviews?.find((r) => r.authorId === user?.id);

  if (myReview) {
    return (
      <Card>
        <h3>Your review for {targetName}</h3>
        <div className="mt-2 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= myReview.rating ? "text-status-pending" : "text-border"
              }
            >
              ★
            </span>
          ))}
        </div>
        {myReview.comment && (
          <p className="text-text-secondary mt-2 text-sm">{myReview.comment}</p>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <h3>Leave a review for {targetName}</h3>
      <ReviewForm
        contractId={contractId}
        targetName={targetName}
        onSubmitted={() => refetch()}
      />
    </Card>
  );
}
