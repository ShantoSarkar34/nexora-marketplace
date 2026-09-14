export type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  imageUrl?: string;
  createdAt: string;
}
