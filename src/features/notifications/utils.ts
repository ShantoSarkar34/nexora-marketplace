import type { AppNotification } from "@/types/notification";
import type { UserRole } from "@/types/user";

function extractId(link?: string | null): string | null {
  if (!link) return null;
  const match = link.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  );
  return match ? match[0] : null;
}

export function getNotificationLink(
  notification: AppNotification,
  role: UserRole,
): string {
  const base = role === "CLIENT" ? "/client" : "/freelancer";
  const id = extractId(notification.link);

  switch (notification.type) {
    case "NEW_APPLICATION":
      return id ? `${base}/applications?jobId=${id}` : `${base}/applications`;
    case "APPLICATION_SHORTLISTED":
    case "APPLICATION_REJECTED":
      return id ? `${base}/applications/${id}` : `${base}/applications`;
    case "FREELANCER_HIRED":
    case "CONTRACT_ACTIVATED":
    case "WORK_SUBMITTED":
    case "CONTRACT_COMPLETED":
      return id ? `${base}/contracts/${id}` : `${base}/contracts`;
    case "PAYMENT_SUCCESSFUL":
      return id
        ? `${base}/contracts/${id}`
        : role === "CLIENT"
          ? "/client/payments"
          : `${base}/contracts`;
    case "NEW_REVIEW":
      return `${base}/profile`;
    default:
      return base;
  }
}
