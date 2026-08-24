export type ContractStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUBMITTED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export interface Contract {
  id: string;
  jobTitle: string;
  clientName: string;
  freelancerName: string;
  budget: number;
  budgetType: "FIXED" | "HOURLY";
  status: ContractStatus;
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  workSubmissionNote?: string;
}
