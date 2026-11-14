"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { isAwaitingActivation } from "@/features/contracts/utils";
import { contractsService } from "@/services/contracts";
import type { ContractStatus } from "@/types/enums";

// While a payment is being confirmed, check the contract every few seconds,
// for about two minutes.
const ACTIVATION_POLL_MS = 3_000;
const ACTIVATION_POLL_MAX_UPDATES = 40;

// One page of the contracts list, for the list screens.
export function useContractsPage(
  params: {
    status?: ContractStatus | "ALL";
    page?: number;
    limit?: number;
  } = {},
) {
  const { status, ...rest } = params;
  return useQuery({
    queryKey: ["contracts", "mine", "page", params],
    queryFn: () =>
      contractsService.myContracts({
        ...rest,
        status: status && status !== "ALL" ? status : undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// A user's contracts as a plain array, for screens that only look one up by id.
export function useMyContracts(limit = 50) {
  return useQuery({
    queryKey: ["contracts", "mine", "all", limit],
    queryFn: async () =>
      (await contractsService.myContracts({ limit })).contracts,
  });
}

export function useContract(contractId: string) {
  return useQuery({
    queryKey: ["contracts", "detail", contractId],
    queryFn: () => contractsService.getById(contractId),
    enabled: !!contractId,
    // Contract state moves under you (payment confirmations, the other
    // person's actions), so never trust a cached copy when the page opens.
    staleTime: 0,
    refetchOnWindowFocus: true,
    // A paid contract stays PENDING until the backend confirms the payment.
    refetchInterval: (query) =>
      isAwaitingActivation(query.state.data) &&
      query.state.dataUpdateCount < ACTIVATION_POLL_MAX_UPDATES
        ? ACTIVATION_POLL_MS
        : false,
  });
}

// Contract changes ripple into money and counts on other screens.
function invalidateContractData(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ["contracts"] });
  qc.invalidateQueries({ queryKey: ["payments"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useHireFreelancer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) => contractsService.hire(applicationId),
    onSuccess: (data, applicationId) => {
      invalidateContractData(qc);
      qc.invalidateQueries({
        queryKey: ["applications", "detail", applicationId],
      });
      qc.invalidateQueries({ queryKey: ["applications", "job", data.jobId] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

// Manual fallback; not wired into any screen.
export function useActivateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) => contractsService.activate(contractId),
    onSuccess: () => invalidateContractData(qc),
  });
}

export function useSubmitWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      ...payload
    }: {
      contractId: string;
      submissionNote?: string;
      submissionUrl?: string;
    }) => contractsService.submit(contractId, payload),
    onSuccess: () => invalidateContractData(qc),
  });
}

export function useRequestRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) =>
      contractsService.requestRevision(contractId),
    onSuccess: () => invalidateContractData(qc),
  });
}

export function useApproveWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) => contractsService.approve(contractId),
    onSuccess: () => {
      invalidateContractData(qc);
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useCancelContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      reason,
    }: {
      contractId: string;
      reason: string;
    }) => contractsService.cancel(contractId, reason),
    onSuccess: () => {
      invalidateContractData(qc);
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
