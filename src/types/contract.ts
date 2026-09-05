import { BudgetType, ContractStatus } from "./enums";

export interface Contract {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  budget: number;
  budgetType: BudgetType;
  status: ContractStatus;
  submissionNote?: string;
  submissionUrl?: string;
  createdAt: string;
  activatedAt?: string;
  submittedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}
