import type { UserRole } from "@/features/auth/schemas";

export interface MockUser {
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  profileCompletion?: number; // freelancer only
}

// Track B: replace this with real authenticated user data from a /me endpoint
export const mockUsers: Record<UserRole, MockUser> = {
  FREELANCER: {
    name: "Sarah Khan",
    email: "sarah@example.com",
    role: "FREELANCER",
    avatarInitials: "SK",
    profileCompletion: 68,
  },
  CLIENT: {
    name: "Michael Chen",
    email: "michael@nexteklabs.com",
    role: "CLIENT",
    avatarInitials: "MC",
  },
};