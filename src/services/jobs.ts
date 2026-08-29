import { apiClient } from "@/lib/api-client";
import type { CreateJobFormValues } from "@/features/jobs/schemas";
import type { Job, JobListParams } from "@/types/job";
import type { JobStatus } from "@/types/enums";

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

export const jobsService = {
  list: async (params: JobListParams) => {
    const res = await apiClient.get<Job[]>(`/jobs${buildQuery(params)}`);
    return { jobs: res.data, meta: res.meta };
  },
  getById: async (jobId: string) => {
    const res = await apiClient.get<Job>(`/jobs/${jobId}`);
    return res.data;
  },
  create: async (payload: {
    title: string;
    description: string;
    category: string;
    skills: string[];
    budgetType: string;
    budgetMin: number;
    budgetMax: number;
    experienceLevel: string;
    deadline?: string;
  }) => {
    const res = await apiClient.post<Job>("/jobs", payload);
    return res.data;
  },
  update: async (
    jobId: string,
    payload: Partial<{
      title: string;
      description: string;
      category: string;
      skills: string[];
      budgetType: string;
      budgetMin: number;
      budgetMax: number;
      experienceLevel: string;
      deadline?: string;
    }>,
  ) => {
    const res = await apiClient.patch<Job>(`/jobs/${jobId}`, payload);
    return res.data;
  },
  updateStatus: async (jobId: string, status: JobStatus) => {
    const res = await apiClient.patch<Job>(`/jobs/${jobId}/status`, { status });
    return res.data;
  },
  remove: async (jobId: string) => {
    await apiClient.delete<void>(`/jobs/${jobId}`);
  },
  myJobs: async (params: { page?: number; limit?: number } = {}) => {
    const res = await apiClient.get<Job[]>(
      `/jobs/client/me${buildQuery(params)}`,
    );
    return { jobs: res.data, meta: res.meta };
  },
  savedJobs: async (params: { page?: number; limit?: number } = {}) => {
    const res = await apiClient.get<Job[]>(
      `/jobs/saved/me${buildQuery(params)}`,
    );
    return { jobs: res.data, meta: res.meta };
  },
  save: async (jobId: string) => {
    await apiClient.post<void>(`/jobs/${jobId}/save`);
  },
  unsave: async (jobId: string) => {
    await apiClient.delete<void>(`/jobs/${jobId}/save`);
  },
};
