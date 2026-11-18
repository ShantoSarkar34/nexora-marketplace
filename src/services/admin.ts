import { apiClient } from "@/lib/api-client";
import type { AdminStats, AdminUser, AdminUserListParams } from "@/types/admin";
import type { StatusCounts } from "@/types/dashboard";
import type { ContractStatus, JobStatus } from "@/types/enums";
import type { UserRole } from "@/types/user";

function buildQuery(params: object) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

// The briefing doesn't spell out the shape of `jobs` and `contracts`, so this
// accepts a plain number or { total, byStatus }.
function normalizeCounts<S extends string>(raw: any): StatusCounts<S> {
  if (typeof raw === "number") return { total: raw, byStatus: {} };

  const byStatus = (raw?.byStatus ?? {}) as Partial<Record<S, number>>;
  const summed = Object.values(
    byStatus as Record<string, number | undefined>
  ).reduce<number>((sum, value) => sum + (value ?? 0), 0);

  return {
    total: typeof raw?.total === "number" ? raw.total : summed,
    byStatus,
  };
}

function normalizeStats(raw: any): AdminStats {
  const users = raw?.users ?? {};
  // `byStatus` on users is keyed by role.
  const byRole = (users.byStatus ?? users.byRole ?? {}) as Partial<
    Record<UserRole, number>
  >;
  const summedUsers = Object.values(byRole).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0
  );
  const revenue = raw?.revenue ?? {};

  return {
    users: {
      total: typeof users.total === "number" ? users.total : summedUsers,
      byRole,
      suspended: toNumber(users.suspended),
    },
    jobs: normalizeCounts<JobStatus>(raw?.jobs),
    contracts: normalizeCounts<ContractStatus>(raw?.contracts),
    disputes: { open: toNumber(raw?.disputes?.open) },
    revenue: {
      totalRevenue: toNumber(revenue.totalRevenue),
      platformFees: toNumber(revenue.platformFees),
      inEscrow: toNumber(revenue.inEscrow),
      refunded: toNumber(revenue.refunded),
    },
  };
}

function normalizeAdminUser(raw: any): AdminUser {
  const name = raw.name ?? "";

  return {
    id: raw.id,
    name,
    email: raw.email ?? "",
    role: raw.role,
    isVerified: !!raw.isVerified,
    provider: raw.provider ?? "LOCAL",
    imageUrl: raw.imageUrl ?? null,
    isSuspended: !!(raw.isSuspended ?? raw.suspended ?? raw.suspendedAt),
    suspensionReason: raw.suspensionReason ?? raw.suspendedReason ?? null,
    isDeleted: !!raw.deletedAt || name === "Deleted user",
    createdAt: raw.createdAt,
  };
}

export const adminService = {
  stats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<any>("/admin/stats");
    return normalizeStats(res.data);
  },

  listUsers: async (params: AdminUserListParams = {}) => {
    const res = await apiClient.get<any[]>(`/admin/users${buildQuery(params)}`);
    return { users: res.data.map(normalizeAdminUser), meta: res.meta };
  },

  // `reason` is optional.
  setSuspension: async (
    userId: string,
    payload: { suspended: boolean; reason?: string }
  ) => {
    await apiClient.patch<unknown>(
      `/admin/users/${userId}/suspension`,
      payload
    );
  },
};
