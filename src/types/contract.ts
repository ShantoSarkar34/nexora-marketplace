import type { ContractStatus } from "@/types/enums";

export interface Contract {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  clientImageUrl?: string;
  freelancerId: string;
  freelancerName: string;
  freelancerImageUrl?: string;
  agreedBudget: number;
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
