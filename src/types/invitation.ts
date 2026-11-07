import type { BudgetType, InvitationStatus, JobStatus } from "@/types/enums";

export interface InvitationJob {
  id: string;
  title: string;
  budgetMin: number;
  budgetMax: number;
  budgetType: BudgetType;
  status: JobStatus;
}

export interface InvitationClient {
  id: string;
  name: string;
  imageUrl?: string | null;
  companyName?: string | null;
}

export interface InvitationFreelancer {
  id: string;
  name: string;
  imageUrl?: string | null;
  title?: string | null;
}

export interface Invitation {
  id: string;
  jobId: string;
  message?: string;
  status: InvitationStatus;
  createdAt: string;
  respondedAt?: string;
  job: InvitationJob;
  // The freelancer's inbox includes the client; the client's sent list
  // includes the freelancer.
  client?: InvitationClient;
  freelancer?: InvitationFreelancer;
}