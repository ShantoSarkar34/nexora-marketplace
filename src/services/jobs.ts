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

function normalizeSavedJob(raw: any): Job {
  const job = raw.job ?? raw;
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    category: job.category,
    skills: job.skills ?? [],
    budgetType: job.budgetType,
    budgetMin: Number(job.budgetMin) || 0,
    budgetMax: Number(job.budgetMax) || 0,
    experienceLevel: job.experienceLevel,
    deadline: job.deadline,
    status: job.status,
    clientId: job.clientId ?? job.client?.id ?? "",
    clientName:
      job.clientName ??
      job.client?.name ??
      job.client?.companyName ??
      "Unknown Client",
    applicantCount: job.applicantCount ?? job._count?.applications ?? 0,
    createdAt: job.createdAt,
  };
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
    const res = await apiClient.get<any[]>(
      `/jobs/saved/me${buildQuery(params)}`,
    );
    return { jobs: res.data.map(normalizeSavedJob), meta: res.meta };
  },
  save: async (jobId: string) => {
    await apiClient.post<void>(`/jobs/${jobId}/save`);
  },
  unsave: async (jobId: string) => {
    await apiClient.delete<void>(`/jobs/${jobId}/save`);
  },
};
