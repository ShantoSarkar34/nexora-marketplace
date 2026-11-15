import { apiClient } from "@/lib/api-client";
import type { Contract, ContractAttachment } from "@/types/contract";
import type { ContractStatus } from "@/types/enums";

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

// The API nests job / client / freelancer. We flatten them so pages keep
// working with simple fields.
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
  myContracts: async (
    params: { status?: ContractStatus; page?: number; limit?: number } = {},
  ) => {
    const res = await apiClient.get<any[]>(
      `/contracts/me${buildQuery(params)}`,
    );
    return { contracts: res.data.map(normalizeContract), meta: res.meta };
  },
  getById: async (contractId: string) => {
    const res = await apiClient.get<any>(`/contracts/${contractId}`);
    return normalizeContract(res.data);
  },
  // Manual fallback; payment normally activates the contract. Not wired into
  // any screen.
  activate: async (contractId: string) => {
    const res = await apiClient.patch<any>(`/contracts/${contractId}/activate`);
    return normalizeContract(res.data);
  },
  // At least one of note, link or attachments is required (up to 5 files).
  submit: async (
    contractId: string,
    payload: {
      submissionNote?: string;
      submissionUrl?: string;
      attachments?: ContractAttachment[];
    },
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
