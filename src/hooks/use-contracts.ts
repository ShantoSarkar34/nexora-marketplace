"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { contractsService } from "@/services/contracts";

export function useMyContracts() {
  return useQuery({
    queryKey: ["contracts", "mine"],
    queryFn: contractsService.myContracts,
  });
}

export function useContract(contractId: string) {
  return useQuery({
    queryKey: ["contracts", "detail", contractId],
    queryFn: () => contractsService.getById(contractId),
    enabled: !!contractId,
  });
}

function invalidateContract(
  qc: ReturnType<typeof useQueryClient>,
  contractId: string,
) {
  qc.invalidateQueries({ queryKey: ["contracts", "mine"] });
  qc.invalidateQueries({ queryKey: ["contracts", "detail", contractId] });
}

export function useHireFreelancer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) => contractsService.hire(applicationId),
    onSuccess: (data, applicationId) => {
      qc.invalidateQueries({ queryKey: ["contracts", "mine"] });
      qc.invalidateQueries({
        queryKey: ["applications", "detail", applicationId],
      });
      qc.invalidateQueries({ queryKey: ["applications", "job", data.jobId] });
      qc.invalidateQueries({ queryKey: ["jobs", "mine"] });
    },
  });
}

export function useActivateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) => contractsService.activate(contractId),
    onSuccess: (_d, contractId) => invalidateContract(qc, contractId),
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
    onSuccess: (_d, { contractId }) => invalidateContract(qc, contractId),
  });
}

export function useRequestRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) =>
      contractsService.requestRevision(contractId),
    onSuccess: (_d, contractId) => invalidateContract(qc, contractId),
  });
}

export function useApproveWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) => contractsService.approve(contractId),
    onSuccess: (_d, contractId) => {
      invalidateContract(qc, contractId);
      qc.invalidateQueries({ queryKey: ["jobs", "mine"] });
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
    onSuccess: (_d, { contractId }) => invalidateContract(qc, contractId),
  });
}
