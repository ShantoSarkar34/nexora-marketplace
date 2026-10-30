import { apiClient } from "@/lib/api-client";
import type { Contract } from "@/types/contract";

function normalizeContract(raw: any): Contract {
  const job = raw.job ?? {};
  const client = raw.client ?? {};
  const freelancer = raw.freelancer ?? {};

  return {
    id: raw.id,
    jobId: raw.jobId ?? job.id,
    applicationId: raw.applicationId ?? undefined,
    jobTitle: job.title ?? "Untitled job",
    jobStatus: job.status ?? undefined,
    budgetType: job.budgetType ?? undefined,
    clientId: raw.clientId ?? client.id ?? "",
    clientName: client.name ?? "Unknown Client",
    clientImageUrl: client.imageUrl ?? undefined,
    freelancerId: raw.freelancerId ?? freelancer.id ?? "",
    freelancerName: freelancer.name ?? "Unknown Freelancer",
    freelancerImageUrl: freelancer.imageUrl ?? undefined,
    agreedBudget: raw.agreedBudget ?? 0,
    status: raw.status,
    paymentStatus: raw.paymentStatus ?? null,
    submissionNote: raw.submissionNote ?? undefined,
    submissionUrl: raw.submissionUrl ?? undefined,
    attachments: raw.attachments ?? [],
    createdAt: raw.createdAt,
    submittedAt: raw.submittedAt ?? undefined,
    completedAt: raw.completedAt ?? undefined,
    cancelledAt: raw.cancelledAt ?? undefined,
    cancelReason: raw.cancelReason ?? undefined,
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
