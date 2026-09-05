import { apiClient } from "@/lib/api-client";
import type { Review, ReviewSummary } from "@/types/review";
import type { ReviewFormValues } from "@/features/reviews/schemas";

export const reviewsService = {
  getForUser: async (
    userId: string,
    params: { page?: number; limit?: number } = {},
  ) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    const qs = search.toString();
    const res = await apiClient.get<Review[]>(
      `/reviews/user/${userId}${qs ? `?${qs}` : ""}`,
    );
    return { reviews: res.data, meta: res.meta };
  },
  getSummaryForUser: async (userId: string) => {
    const res = await apiClient.get<ReviewSummary>(
      `/reviews/user/${userId}/summary`,
    );
    return res.data;
  },
  getForContract: async (contractId: string) => {
    const res = await apiClient.get<Review[]>(
      `/reviews/contract/${contractId}`,
    );
    return res.data;
  },
  submit: async (contractId: string, payload: ReviewFormValues) => {
    const res = await apiClient.post<Review>(
      `/reviews/contract/${contractId}`,
      payload,
    );
    return res.data;
  },
};
