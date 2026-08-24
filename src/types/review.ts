export interface Review {
  id: string;
  contractId: string;
  authorName: string;
  authorRole: "CLIENT" | "FREELANCER";
  targetName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
