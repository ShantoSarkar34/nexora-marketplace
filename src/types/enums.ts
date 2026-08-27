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

export type BudgetType = "FIXED" | "HOURLY";

export const budgetTypeLabels: Record<BudgetType, string> = {
  FIXED: "Fixed price",
  HOURLY: "Hourly",
};
