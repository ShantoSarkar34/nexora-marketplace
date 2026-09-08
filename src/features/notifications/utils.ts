import type { AppNotification } from "@/types/notification";
import type { UserRole } from "@/types/user";

export function getNotificationLink(
  notification: AppNotification,
  role: UserRole,
): string {
  if (notification.link) return notification.link;

  const base = role === "CLIENT" ? "/client" : "/freelancer";

  switch (notification.type) {
    case "NEW_APPLICATION":
      return `${base}/applications`;
    case "APPLICATION_SHORTLISTED":
    case "APPLICATION_REJECTED":
      return `${base}/applications`;
    case "FREELANCER_HIRED":
    case "CONTRACT_ACTIVATED":
    case "WORK_SUBMITTED":
    case "CONTRACT_COMPLETED":
      return `${base}/contracts`;
    case "PAYMENT_SUCCESSFUL":
      return role === "CLIENT" ? "/client/payments" : `${base}/contracts`;
    case "NEW_REVIEW":
      return `${base}/profile`;
    default:
      return base;
  }
}
