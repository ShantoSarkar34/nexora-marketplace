import type { Review } from "@/types/review";

// Track B: replace with GET /reviews?userId=
export const mockReviews: Review[] = [
  {
    id: "rev-1",
    contractId: "contract-3",
    authorName: "Alex Rivera",
    authorRole: "CLIENT",
    targetName: "Sarah Khan",
    rating: 5,
    comment: "Sarah delivered high-quality posts on time, every time. Great communicator too. Would hire again.",
    createdAt: "2026-07-31",
  },
];