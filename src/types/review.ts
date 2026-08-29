export interface Review {
  id: string;
  rating: number;
  comment?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}