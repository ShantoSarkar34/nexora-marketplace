export type ApplicationStatus = "PENDING" | "SHORTLISTED" | "REJECTED" | "HIRED" | "WITHDRAWN";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  freelancerTitle: string;
  freelancerAvatarInitials: string;
  coverLetter: string;
  proposedBudget: number;
  estimatedDays: number;
  status: ApplicationStatus;
  appliedAt: string;
}