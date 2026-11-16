import { apiClient } from "@/lib/api-client";
import type { DisputeStatus } from "@/types/enums";
import type { Dispute, DisputeParty } from "@/types/dispute";

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

function normalizeParty(raw: any): DisputeParty {
  return {
    id: raw?.id ?? "",
    name: raw?.name ?? "Unknown user",
    imageUrl: raw?.imageUrl ?? null,
  };
}

function normalizeDispute(raw: any): Dispute {
  const contract = raw.contract ?? {};
  const job = contract.job ?? {};

  return {
    id: raw.id,
    contractId: raw.contractId ?? contract.id ?? "",
    status: raw.status,
    reason: raw.reason ?? "",
    previousContractStatus: raw.previousContractStatus ?? null,
    resolution: raw.resolution ?? null,
    resolutionNote: raw.resolutionNote ?? null,
    refundStatus: raw.refundStatus ?? null,
    resolvedAt: raw.resolvedAt ?? null,
    createdAt: raw.createdAt,
    openedBy: normalizeParty(raw.openedBy),
    contract: {
      id: contract.id ?? raw.contractId ?? "",
      status: contract.status,
      agreedBudget: contract.agreedBudget ?? 0,
      job: {
        id: job.id ?? contract.jobId ?? "",
        title: job.title ?? "Untitled job",
      },
      client: normalizeParty(contract.client),
      freelancer: normalizeParty(contract.freelancer),
    },
    resolvedBy: raw.resolvedBy ? normalizeParty(raw.resolvedBy) : null,
    refund: raw.refund
      ? {
          stripeRefundId: raw.refund.stripeRefundId ?? null,
          error: raw.refund.error ?? null,
        }
      : null,
  };
}

export const disputesService = {
  list: async (
    params: {
      status?: DisputeStatus;
      contractId?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const res = await apiClient.get<any[]>(`/disputes/me${buildQuery(params)}`);
    return { disputes: res.data.map(normalizeDispute), meta: res.meta };
  },

  getById: async (disputeId: string) => {
    const res = await apiClient.get<any>(`/disputes/${disputeId}`);
    return normalizeDispute(res.data);
  },

  // The reason must be 20–2000 characters. The result isn't used: the
  // screens refetch the contract and disputes instead.
  open: async (contractId: string, reason: string) => {
    await apiClient.post<unknown>(`/contracts/${contractId}/dispute`, {
      reason,
    });
  },

  // Only the person who opened the dispute can withdraw it, and only while it
  // is OPEN.
  withdraw: async (disputeId: string) => {
    await apiClient.patch<unknown>(`/disputes/${disputeId}/withdraw`);
  },
};
