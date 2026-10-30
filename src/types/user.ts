export type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";
export type AuthProvider = "LOCAL" | "GOOGLE";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  provider: AuthProvider;
  imageUrl?: string | null;
  createdAt: string;
}
