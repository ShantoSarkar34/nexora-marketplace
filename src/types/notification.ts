export type NotificationType =
  | "NEW_APPLICATION"
  | "SHORTLISTED"
  | "REJECTED"
  | "HIRED"
  | "PAYMENT_SUCCESS"
  | "CONTRACT_ACTIVE"
  | "WORK_SUBMITTED"
  | "CONTRACT_COMPLETED"
  | "NEW_REVIEW";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
