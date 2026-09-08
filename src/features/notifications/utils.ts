import type { AppNotification } from "@/types/notification";
import type { UserRole } from "@/types/user";

// Extracts the trailing UUID from a backend-provided link like
// "/contracts/abc-123" or "/jobs/abc-123/applications" — used since the
// backend's `link` field isn't role-prefixed and can't be used as-is.
function extractId(link?: string): string | null {
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
