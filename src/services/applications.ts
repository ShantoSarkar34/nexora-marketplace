import { apiClient } from "@/lib/api-client";
import type { ApplyJobFormValues } from "@/features/applications/schemas";
import type { ApplicationStatus } from "@/types/enums";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  clientImageUrl?: string;
  freelancerId: string;
  freelancerName: string;
  freelancerImageUrl?: string;
  freelancerTitle?: string;
  coverLetter: string;
  proposedBudget: number;
  estimatedDeliveryDays: number;
  status: ApplicationStatus;
  createdAt: string;
}

function normalizeApplication(raw: any): Application {
  const job = raw.job ?? {};
  const client = job.client ?? {};
  const freelancer = raw.freelancer ?? {};
  const freelancerProfile = freelancer.freelancerProfile ?? {};

  return {
    id: raw.id,
    jobId: raw.jobId ?? job.id,
    jobTitle: job.title ?? "Untitled job",
    clientId: job.clientId ?? client.id ?? "",
    clientName: client.name ?? "",
    clientImageUrl: client.imageUrl ?? undefined,
    freelancerId: raw.freelancerId ?? freelancer.id ?? "",
    freelancerName: freelancer.name ?? "Unknown Freelancer",
    freelancerImageUrl: freelancer.imageUrl ?? undefined,
    freelancerTitle: freelancerProfile.title ?? undefined,
    coverLetter: raw.coverLetter ?? "",
    proposedBudget: raw.proposedBudget ?? 0,
    estimatedDeliveryDays: raw.estimatedDeliveryDays ?? 0,
    status: raw.status,
    createdAt: raw.createdAt,
  };
}

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

export const applicationsService = {
  apply: async (jobId: string, payload: ApplyJobFormValues) => {
    const res = await apiClient.post<any>("/applications", {
      jobId,
      ...payload,
    });
    return normalizeApplication(res.data);
  },
  myApplications: async (
    params: { status?: ApplicationStatus; page?: number; limit?: number } = {},
  ) => {
    const res = await apiClient.get<any[]>(
      `/applications/me${buildQuery(params)}`,
    );
    return { applications: res.data.map(normalizeApplication), meta: res.meta };
  },
  getById: async (applicationId: string) => {
    const res = await apiClient.get<any>(`/applications/${applicationId}`);
    return normalizeApplication(res.data);
  },
  withdraw: async (applicationId: string) => {
    const res = await apiClient.post<any>(
      `/applications/${applicationId}/withdraw`,
    );
    return normalizeApplication(res.data);
  },
  forJob: async (jobId: string) => {
    const res = await apiClient.get<any[]>(`/applications/job/${jobId}`);
    return res.data.map(normalizeApplication);
  },
  updateStatus: async (
    applicationId: string,
    status: "SHORTLISTED" | "REJECTED",
  ) => {
    const res = await apiClient.patch<any>(
      `/applications/${applicationId}/status`,
      {
        status,
      },
    );
    return normalizeApplication(res.data);
  },
};
