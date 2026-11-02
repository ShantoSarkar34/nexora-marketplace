import type { NotificationType } from "@/types/enums";
import type { AppNotification } from "@/types/notification";
import type { UserRole } from "@/types/user";

function rolePrefix(role: UserRole): string {
  return role === "CLIENT" ? "/client" : "/freelancer";
}

function sectionFor(type: NotificationType, role: UserRole): string {
  const base = rolePrefix(role);

  switch (type) {
    case "NEW_APPLICATION":
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
      return `${base}/dashboard`;
  }
}

export function getNotificationLink(
  notification: AppNotification,
  role: UserRole,
): string {
  const base = rolePrefix(role);
  const { type, entityType, entityId, meta } = notification;
  const jobId = meta?.jobId;
  const contractId = meta?.contractId;

  switch (entityType) {
    case "JOB":
      return entityId ? `/jobs/${entityId}` : sectionFor(type, role);

    case "APPLICATION":
      if (entityId) return `${base}/applications/${entityId}`;
      if (role === "CLIENT" && jobId) {
        return `/client/applications?jobId=${jobId}`;
      }
      return `${base}/applications`;

    case "CONTRACT":
      return entityId ? `${base}/contracts/${entityId}` : `${base}/contracts`;

    case "PAYMENT":
      return contractId
        ? `${base}/contracts/${contractId}`
        : sectionFor(type, role);

    case "REVIEW":
      return `${base}/profile`;

    case "INVITATION":
      return jobId ? `/jobs/${jobId}` : `${base}/dashboard`;

    case "CONVERSATION":
      // Built in C7.
      return entityId ? `${base}/messages/${entityId}` : `${base}/messages`;

    case "DISPUTE":
      // Built in C14.
      return entityId ? `${base}/disputes/${entityId}` : `${base}/disputes`;

    default:
      return sectionFor(type, role);
  }
}
