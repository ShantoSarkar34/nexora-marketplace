"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reviewsService } from "@/services/reviews";
import type { ReviewFormValues } from "@/features/reviews/schemas";

export function useUserReviews(
  userId: string,
  params: { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: ["reviews", "user", userId, params],
    queryFn: () => reviewsService.getForUser(userId, params),
    enabled: !!userId,
  });
}

export function useUserReviewSummary(userId: string) {
  return useQuery({
    queryKey: ["reviews", "summary", userId],
    queryFn: () => reviewsService.getSummaryForUser(userId),
    enabled: !!userId,
  });
}

export function useContractReviews(contractId: string) {
  return useQuery({
    queryKey: ["reviews", "contract", contractId],
    queryFn: () => reviewsService.getForContract(contractId),
    enabled: !!contractId,
    retry: false,
    meta: { silent: true }, 
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      values,
    }: {
      contractId: string;
      values: ReviewFormValues;
    }) => reviewsService.submit(contractId, values),
    onSuccess: (_data, { contractId }) => {
      qc.invalidateQueries({ queryKey: ["reviews", "contract", contractId] });
    },
  });
}
