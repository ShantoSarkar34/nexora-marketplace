"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { adminService } from "@/services/admin";
import { disputesService } from "@/services/disputes";
import type {
  AdminJobAction,
  AdminJobListParams,
  AdminUserListParams,
} from "@/types/admin";
import type { DisputeResolution, DisputeStatus } from "@/types/enums";

export function useAdminStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminService.stats,
    enabled: user?.role === "ADMIN",
    // Refetch every time the overview opens and when the tab regains focus.
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useAdminUsers(params: AdminUserListParams) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminService.listUsers(params),
    enabled: user?.role === "ADMIN",
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

export function useSetUserSuspension() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      suspended,
      reason,
    }: {
      userId: string;
      suspended: boolean;
      reason?: string;
    }) => adminService.setSuspension(userId, { suspended, reason }),
    // The users list and the suspended count on the overview both change.
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useAdminJobs(params: AdminJobListParams) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin", "jobs", params],
    queryFn: () => adminService.listJobs(params),
    enabled: user?.role === "ADMIN",
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

export function useSetJobStatusAsAdmin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      status,
      note,
    }: {
      jobId: string;
      status: AdminJobAction;
      note?: string;
    }) => adminService.setJobStatus(jobId, { status, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      // The job disappears from the public list and from its owner's jobs.
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useAdminDisputes(
  params: {
    status?: DisputeStatus | "ALL";
    page?: number;
    limit?: number;
  } = {},
) {
  const { user } = useAuth();
  const { status, ...rest } = params;

  return useQuery({
    queryKey: ["admin", "disputes", params],
    queryFn: () =>
      disputesService.adminList({
        ...rest,
        status: status && status !== "ALL" ? status : undefined,
      }),
    enabled: user?.role === "ADMIN",
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// Resolving a dispute can move a contract, a payment, a job and the money
// numbers on several screens.
function invalidateAfterResolution(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ["admin"] });
  qc.invalidateQueries({ queryKey: ["disputes"] });
  qc.invalidateQueries({ queryKey: ["contracts"] });
  qc.invalidateQueries({ queryKey: ["payments"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
  qc.invalidateQueries({ queryKey: ["jobs"] });
}

export function useResolveDispute() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      disputeId,
      resolution,
      note,
    }: {
      disputeId: string;
      resolution: DisputeResolution;
      note: string;
    }) => disputesService.resolve(disputeId, { resolution, note }),
    onSuccess: () => invalidateAfterResolution(qc),
    // A rejected attempt usually means the dispute moved on (withdrawn or
    // already resolved), so show its real state.
    onError: () => {
      qc.invalidateQueries({ queryKey: ["disputes"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}