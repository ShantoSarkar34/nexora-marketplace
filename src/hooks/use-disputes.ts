"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { disputesService } from "@/services/disputes";
import type { DisputeStatus } from "@/types/enums";

export function useDisputes(
  params: {
    status?: DisputeStatus | "ALL";
    page?: number;
    limit?: number;
  } = {},
) {
  const { status, ...rest } = params;
  return useQuery({
    queryKey: ["disputes", "mine", params],
    queryFn: () =>
      disputesService.list({
        ...rest,
        status: status && status !== "ALL" ? status : undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

export function useDispute(disputeId: string) {
  return useQuery({
    queryKey: ["disputes", "detail", disputeId],
    queryFn: () => disputesService.getById(disputeId),
    enabled: !!disputeId,
    // A dispute can be resolved at any moment, so never trust a cached copy.
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// Every dispute on one contract (newest first once sorted by the caller).
export function useContractDisputes(contractId: string, enabled = true) {
  return useQuery({
    queryKey: ["disputes", "contract", contractId],
    queryFn: async () =>
      (await disputesService.list({ contractId, limit: 10 })).disputes,
    enabled: enabled && !!contractId,
    staleTime: 0,
    refetchOnWindowFocus: true,
    // A secondary lookup on the contract page. The contract's own query
    // already handles sign-out and suspension, so a failure here stays quiet.
    meta: { silent: true },
  });
}

// A dispute changes the contract's status and the counts on the dashboards.
function invalidateDisputeData(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ["disputes"] });
  qc.invalidateQueries({ queryKey: ["contracts"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useOpenDispute(contractId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => disputesService.open(contractId, reason),
    meta: {
      forbiddenMessage:
        "You can only open a dispute on a contract you're part of.",
    },
    onSuccess: () => invalidateDisputeData(qc),
    // A rejected attempt usually means the contract moved on (already
    // disputed, completed or cancelled), so show its real state.
    onError: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}

export function useWithdrawDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (disputeId: string) => disputesService.withdraw(disputeId),
    onSuccess: () => invalidateDisputeData(qc),
    onError: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}