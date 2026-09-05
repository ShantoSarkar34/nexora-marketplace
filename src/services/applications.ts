import { apiClient } from "@/lib/api-client";
import type { ApplyJobFormValues } from "@/features/applications/schemas";
import type { ApplicationStatus } from "@/types/enums";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  freelancerTitle?: string;
  coverLetter: string;
  proposedBudget: number;
  estimatedDeliveryDays: number;
  status: ApplicationStatus;
  createdAt: string;
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
    const res = await apiClient.post<Application>("/applications", {
      jobId,
      ...payload,
    });
    return res.data;
  },
  myApplications: async (
    params: { status?: ApplicationStatus; page?: number; limit?: number } = {},
  ) => {
    const res = await apiClient.get<Application[]>(
      `/applications/me${buildQuery(params)}`,
    );
    return { applications: res.data, meta: res.meta };
  },
  getById: async (applicationId: string) => {
    const res = await apiClient.get<Application>(
      `/applications/${applicationId}`,
    );
    return res.data;
  },
  withdraw: async (applicationId: string) => {
    const res = await apiClient.post<Application>(
      `/applications/${applicationId}/withdraw`,
    );
    return res.data;
  },
  forJob: async (jobId: string) => {
    const res = await apiClient.get<Application[]>(
      `/applications/job/${jobId}`,
    );
    return res.data;
  },
  updateStatus: async (
    applicationId: string,
    status: "SHORTLISTED" | "REJECTED",
  ) => {
    const res = await apiClient.patch<Application>(
      `/applications/${applicationId}/status`,
      { status },
    );
    return res.data;
  },
};
