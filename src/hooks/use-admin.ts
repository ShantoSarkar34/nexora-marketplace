"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { adminService } from "@/services/admin";
import type { AdminUserListParams } from "@/types/admin";

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