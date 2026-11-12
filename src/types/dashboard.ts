import type {
  ApplicationStatus,
  ContractStatus,
  JobStatus,
} from "@/types/enums";
import type { Earnings, Spending } from "@/types/payment";

// The API sends every status key, zero-filled. A missing one counts as zero.
export interface StatusCounts<S extends string> {
  total: number;
  byStatus: Partial<Record<S, number>>;
}

export interface FreelancerDashboardStats {
  applications: StatusCounts<ApplicationStatus>;
  contracts: StatusCounts<ContractStatus>;
  savedJobs: number;
  unreadNotifications: number;
  profile: {
    hasProfile: boolean;
    completionPercentage: number;
  };
  earnings: Earnings;
}

export interface ClientDashboardStats {
  jobs: StatusCounts<JobStatus>;
  totalApplicants: number;
  contracts: StatusCounts<ContractStatus>;
  spending: Spending;
  unreadNotifications: number;
}
