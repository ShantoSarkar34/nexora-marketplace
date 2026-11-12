import { apiClient } from "@/lib/api-client";
import type {
  ClientDashboardStats,
  FreelancerDashboardStats,
  StatusCounts,
} from "@/types/dashboard";
import type {
  ApplicationStatus,
  ContractStatus,
  JobStatus,
} from "@/types/enums";
import type { Earnings, Spending } from "@/types/payment";

// A count can arrive as a plain number or as { total }.
function toCount(value: unknown): number {
  if (typeof value === "number") return value;
  const total = (value as { total?: unknown } | null | undefined)?.total;
  return typeof total === "number" ? total : 0;
}

function normalizeCounts<S extends string>(raw: any): StatusCounts<S> {
  if (typeof raw === "number") return { total: raw, byStatus: {} };

  const byStatus: Partial<Record<S, number>> = raw?.byStatus ?? {};
  const summed = Object.values(
    byStatus as Record<string, number | undefined>,
  ).reduce<number>((sum, value) => sum + (value ?? 0), 0);

  return { total: raw?.total ?? summed, byStatus };
}

function normalizeEarnings(raw: any): Earnings {
  return {
    totalEarned: raw?.totalEarned ?? 0,
    inEscrow: raw?.inEscrow ?? 0,
    platformFeesPaid: raw?.platformFeesPaid ?? 0,
    completedContracts: raw?.completedContracts ?? 0,
  };
}

function normalizeSpending(raw: any): Spending {
  return {
    totalSpent: raw?.totalSpent ?? 0,
    inEscrow: raw?.inEscrow ?? 0,
    completedContracts: raw?.completedContracts ?? 0,
  };
}

export const dashboardService = {
  freelancer: async (): Promise<FreelancerDashboardStats> => {
    const res = await apiClient.get<any>("/dashboard/freelancer/stats");
    const raw = res.data ?? {};

    return {
      applications: normalizeCounts<ApplicationStatus>(raw.applications),
      contracts: normalizeCounts<ContractStatus>(raw.contracts),
      savedJobs: toCount(raw.savedJobs),
      unreadNotifications: toCount(raw.unreadNotifications),
      profile: {
        hasProfile: !!raw.profile?.hasProfile,
        completionPercentage: raw.profile?.completionPercentage ?? 0,
      },
      earnings: normalizeEarnings(raw.earnings),
    };
  },

  client: async (): Promise<ClientDashboardStats> => {
    const res = await apiClient.get<any>("/dashboard/client/stats");
    const raw = res.data ?? {};

    return {
      jobs: normalizeCounts<JobStatus>(raw.jobs),
      totalApplicants: toCount(raw.totalApplicants),
      contracts: normalizeCounts<ContractStatus>(raw.contracts),
      spending: normalizeSpending(raw.spending),
      unreadNotifications: toCount(raw.unreadNotifications),
    };
  },
};
