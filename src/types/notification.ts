export type NotificationType =
  | "NEW_APPLICATION"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_REJECTED"
  | "FREELANCER_HIRED"
  | "CONTRACT_ACTIVATED"
  | "WORK_SUBMITTED"
  | "CONTRACT_COMPLETED"
  | "PAYMENT_SUCCESSFUL"
  | "NEW_REVIEW";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
