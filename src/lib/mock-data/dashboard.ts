import type { UserRole } from "@/features/auth/schemas";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  profileCompletion?: number;
  isVerified: boolean;
  createdAt: string;
}

// Track B: replace this with real authenticated user data from a /me endpoint
export const mockUsers: Record<UserRole, MockUser> = {
  FREELANCER: {
    name: "Sarah Khan",
    email: "sarah@example.com",
    role: "FREELANCER",
    avatarInitials: "SK",
    profileCompletion: 68,
    id: "asdfhasdfsdkf",
    isVerified: false,
    createdAt: "2026-08-18",
  },
  CLIENT: {
    name: "Michael Chen",
    email: "michael@nexteklabs.com",
    role: "CLIENT",
    avatarInitials: "MC",
    id: "asdsdfasdd67df7dfsd",
    isVerified: false,
    createdAt: "2026-08-18",
  },
};
