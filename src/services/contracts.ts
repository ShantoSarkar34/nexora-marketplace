import { apiClient } from "@/lib/api-client";
import type { Contract } from "@/types/contract";

export const contractsService = {
  hire: async (applicationId: string) => {
    const res = await apiClient.post<Contract>(
      `/contracts/hire/${applicationId}`,
    );
    return res.data;
  },
  myContracts: async () => {
    const res = await apiClient.get<Contract[]>("/contracts/me");
    return res.data;
  },
  getById: async (contractId: string) => {
    const res = await apiClient.get<Contract>(`/contracts/${contractId}`);
    return res.data;
  },
  activate: async (contractId: string) => {
    const res = await apiClient.patch<Contract>(
      `/contracts/${contractId}/activate`,
    );
    return res.data;
  },
  submit: async (
    contractId: string,
    payload: { submissionNote?: string; submissionUrl?: string },
  ) => {
    const res = await apiClient.patch<Contract>(
      `/contracts/${contractId}/submit`,
      payload,
    );
    return res.data;
  },
  requestRevision: async (contractId: string) => {
    const res = await apiClient.patch<Contract>(
      `/contracts/${contractId}/request-revision`,
    );
    return res.data;
  },
  approve: async (contractId: string) => {
    const res = await apiClient.patch<Contract>(
      `/contracts/${contractId}/approve`,
    );
    return res.data;
  },
  cancel: async (contractId: string, reason: string) => {
    const res = await apiClient.patch<Contract>(
      `/contracts/${contractId}/cancel`,
      { reason },
    );
    return res.data;
  },
};
