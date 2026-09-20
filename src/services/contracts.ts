import { apiClient } from "@/lib/api-client";
import type { Contract } from "@/types/contract";

function normalizeContract(raw: any): Contract {
  const freelancer = raw.freelancer ?? {};
  const client = raw.client ?? {};
  const job = raw.job ?? {};

  return {
    id: raw.id,
    jobId: raw.jobId ?? job.id,
    jobTitle: raw.jobTitle ?? job.title ?? "Untitled job",
    clientId: raw.clientId ?? client.id ?? "",
    clientName: raw.clientName ?? client.name ?? "Unknown Client",
    clientImageUrl: raw.clientImageUrl ?? client.imageUrl,
    freelancerId: raw.freelancerId ?? freelancer.id ?? "",
    freelancerName:
      raw.freelancerName ?? freelancer.name ?? "Unknown Freelancer",
    freelancerImageUrl: raw.freelancerImageUrl ?? freelancer.imageUrl,
    agreedBudget: Number(raw.agreedBudget) || 0,
    status: raw.status,
    submissionNote: raw.submissionNote,
    submissionUrl: raw.submissionUrl,
    createdAt: raw.createdAt,
    activatedAt: raw.activatedAt,
    submittedAt: raw.submittedAt,
    completedAt: raw.completedAt,
    cancelledAt: raw.cancelledAt,
    cancelReason: raw.cancelReason,
  };
}

export const contractsService = {
  hire: async (applicationId: string) => {
    const res = await apiClient.post<any>(`/contracts/hire/${applicationId}`);
    return normalizeContract(res.data);
  },
  myContracts: async () => {
    const res = await apiClient.get<any[]>("/contracts/me");
    return res.data.map(normalizeContract);
  },
  getById: async (contractId: string) => {
    const res = await apiClient.get<any>(`/contracts/${contractId}`);
    return normalizeContract(res.data);
  },
  activate: async (contractId: string) => {
    const res = await apiClient.patch<any>(`/contracts/${contractId}/activate`);
    return normalizeContract(res.data);
  },
  submit: async (
    contractId: string,
    payload: { submissionNote?: string; submissionUrl?: string },
  ) => {
    const res = await apiClient.patch<any>(
      `/contracts/${contractId}/submit`,
      payload,
    );
    return normalizeContract(res.data);
  },
  requestRevision: async (contractId: string) => {
    const res = await apiClient.patch<any>(
      `/contracts/${contractId}/request-revision`,
    );
    return normalizeContract(res.data);
  },
  approve: async (contractId: string) => {
    const res = await apiClient.patch<any>(`/contracts/${contractId}/approve`);
    return normalizeContract(res.data);
  },
  cancel: async (contractId: string, reason: string) => {
    const res = await apiClient.patch<any>(`/contracts/${contractId}/cancel`, {
      reason,
    });
    return normalizeContract(res.data);
  },
};
