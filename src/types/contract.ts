import type {
  BudgetType,
  ContractStatus,
  JobStatus,
  PaymentStatus,
} from "@/types/enums";

export interface ContractAttachment {
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Contract {
  id: string;
  jobId: string;
  applicationId?: string;
  jobTitle: string;
  jobStatus?: JobStatus;
  budgetType?: BudgetType;
  clientId: string;
  clientName: string;
  clientImageUrl?: string;
  freelancerId: string;
  freelancerName: string;
  freelancerImageUrl?: string;
  agreedBudget: number;
  status: ContractStatus;
  paymentStatus: PaymentStatus | null;
  submissionNote?: string;
  submissionUrl?: string;
  attachments: ContractAttachment[];
  createdAt: string;
  submittedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}
