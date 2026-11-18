import type { UserRole } from "@/types/user";

// Where each kind of account lands after login, and where someone who opens
// the wrong area is sent back to.
export function homePathFor(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "CLIENT":
      return "/client/dashboard";
    default:
      return "/freelancer/dashboard";
  }
}
