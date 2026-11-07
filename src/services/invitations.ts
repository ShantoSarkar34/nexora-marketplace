import { apiClient } from "@/lib/api-client";
import type { InvitationStatus } from "@/types/enums";
import type { Invitation } from "@/types/invitation";

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

// The list endpoints include the job; create / respond / cancel may return a
// slimmer object, so every nested field has a fallback.
function normalizeInvitation(raw: any): Invitation {
  const job = raw.job ?? {};
  return {
    id: raw.id,
    jobId: raw.jobId ?? job.id ?? "",
    message: raw.message ?? undefined,
    status: raw.status,
    createdAt: raw.createdAt,
    respondedAt: raw.respondedAt ?? undefined,
    job: {
      id: job.id ?? raw.jobId ?? "",
      title: job.title ?? "Untitled job",
      budgetMin: job.budgetMin ?? 0,
      budgetMax: job.budgetMax ?? 0,
      budgetType: job.budgetType ?? "FIXED",
      status: job.status ?? "OPEN",
    },
    client: raw.client ?? undefined,
    freelancer: raw.freelancer ?? undefined,
  };
}

export const invitationsService = {
  create: async (payload: {
    jobId: string;
    freelancerId: string;
    message?: string;
  }) => {
    const res = await apiClient.post<any>("/invitations", payload);
    return normalizeInvitation(res.data);
  },
  mine: async (
    params: { status?: InvitationStatus; page?: number; limit?: number } = {},
  ) => {
    const res = await apiClient.get<any[]>(
      `/invitations/me${buildQuery(params)}`,
    );
    return { invitations: res.data.map(normalizeInvitation), meta: res.meta };
  },
  sent: async (
    params: {
      jobId?: string;
      status?: InvitationStatus;
      page?: number;
      limit?: number;
    } = {},
  ) => {
    const res = await apiClient.get<any[]>(
      `/invitations/sent${buildQuery(params)}`,
    );
    return { invitations: res.data.map(normalizeInvitation), meta: res.meta };
  },
  respond: async (invitationId: string, status: "ACCEPTED" | "DECLINED") => {
    const res = await apiClient.patch<any>(
      `/invitations/${invitationId}/respond`,
      { status },
    );
    return normalizeInvitation(res.data);
  },
  cancel: async (invitationId: string) => {
    const res = await apiClient.patch<any>(
      `/invitations/${invitationId}/cancel`,
    );
    return normalizeInvitation(res.data);
  },
};