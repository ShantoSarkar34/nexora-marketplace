export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string | null;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}
