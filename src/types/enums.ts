export type JobCategory =
  | "WEB_DEVELOPMENT"
  | "MOBILE_DEVELOPMENT"
  | "DESIGN"
  | "WRITING"
  | "MARKETING"
  | "DATA_SCIENCE"
  | "DEVOPS"
  | "OTHER";

export const jobCategoryLabels: Record<JobCategory, string> = {
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_DEVELOPMENT: "Mobile Development",
  DESIGN: "Design",
  WRITING: "Writing",
  MARKETING: "Marketing",
  DATA_SCIENCE: "Data Science",
  DEVOPS: "DevOps",
  OTHER: "Other",
};

export type ExperienceLevel = "ENTRY" | "INTERMEDIATE" | "EXPERT";

export const experienceLevelLabels: Record<ExperienceLevel, string> = {
  ENTRY: "Entry",
  INTERMEDIATE: "Intermediate",
  EXPERT: "Expert",
};

export type JobStatus =
  "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "CLOSED";

export const jobStatusLabels: Record<JobStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  CLOSED: "Closed",
};

export type ApplicationStatus =
  "PENDING" | "SHORTLISTED" | "REJECTED" | "HIRED" | "WITHDRAWN";

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  HIRED: "Hired",
  WITHDRAWN: "Withdrawn",
};

export type InvitationStatus =
  "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED" | "EXPIRED";

export const invitationStatusLabels: Record<InvitationStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export type ContractStatus =
  "PENDING" | "ACTIVE" | "SUBMITTED" | "COMPLETED" | "CANCELLED" | "DISPUTED";

export const contractStatusLabels: Record<ContractStatus, string> = {
  PENDING: "Pending — awaiting payment",
  ACTIVE: "Active",
  SUBMITTED: "Submitted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DISPUTED: "Disputed",
};

export type PaymentStatus =
  "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SUCCESS: "Success",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export type DisputeStatus = "OPEN" | "RESOLVED" | "WITHDRAWN";

export const disputeStatusLabels: Record<DisputeStatus, string> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  WITHDRAWN: "Withdrawn",
};

export type DisputeResolution =
  "REFUND_CLIENT" | "RELEASE_TO_FREELANCER" | "NO_ACTION";

export const disputeResolutionLabels: Record<DisputeResolution, string> = {
  REFUND_CLIENT: "Refunded to client",
  RELEASE_TO_FREELANCER: "Released to freelancer",
  NO_ACTION: "No action taken",
};

export type RefundStatus = "SUCCEEDED" | "FAILED" | "NO_PAYMENT";

export const refundStatusLabels: Record<RefundStatus, string> = {
  SUCCEEDED: "Refund succeeded",
  FAILED: "Refund failed",
  NO_PAYMENT: "No payment to refund",
};

export type BudgetType = "FIXED" | "HOURLY";

export const budgetTypeLabels: Record<BudgetType, string> = {
  FIXED: "Fixed price",
  HOURLY: "Hourly",
};

export type Availability = "AVAILABLE" | "BUSY" | "NOT_AVAILABLE";

export const availabilityLabels: Record<Availability, string> = {
  AVAILABLE: "Available",
  BUSY: "Busy",
  NOT_AVAILABLE: "Not available",
};

export type CompanySize = "SOLO" | "SMALL" | "MEDIUM" | "LARGE";

export const companySizeLabels: Record<CompanySize, string> = {
  SOLO: "Solo",
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
};

export type NotificationType =
  | "NEW_APPLICATION"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_REJECTED"
  | "FREELANCER_HIRED"
  | "CONTRACT_ACTIVATED"
  | "WORK_SUBMITTED"
  | "CONTRACT_COMPLETED"
  | "PAYMENT_SUCCESSFUL"
  | "NEW_REVIEW"
  | "NEW_INVITATION"
  | "INVITATION_ACCEPTED"
  | "INVITATION_DECLINED"
  | "NEW_MESSAGE"
  | "DISPUTE_OPENED"
  | "DISPUTE_RESOLVED";

export type EntityType =
  | "JOB"
  | "APPLICATION"
  | "CONTRACT"
  | "PAYMENT"
  | "REVIEW"
  | "INVITATION"
  | "CONVERSATION"
  | "DISPUTE";
