import { apiClient } from "@/lib/api-client";
import type {
  Job,
  JobListParams,
  RecommendedFeed,
  RecommendedJob,
  RecommendedReason,
} from "@/types/job";
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

// GET /jobs/saved/me now returns flat jobs (same shape as the job list) plus
// `savedAt`. Everything on that page is saved by definition. The
// `raw.job ?? raw` keeps working if an old join-row shape ever shows up.
function normalizeSavedJob(raw: any): Job {
  return { ...(raw.job ?? raw), isSaved: true };
}

const RECOMMENDED_REASONS: string[] = ["NO_PROFILE", "NO_SKILLS", "NO_MATCHES"];

function isRecommendedReason(value: unknown): value is RecommendedReason {
  return typeof value === "string" && RECOMMENDED_REASONS.includes(value);
}

// Each item is { job, matchScore (0-100), matchedSkills[] }.
function normalizeRecommended(raw: any): RecommendedJob {
  const score = typeof raw.matchScore === "number" ? raw.matchScore : 0;

  return {
    job: raw.job,
    match: {
      score: Math.max(0, Math.min(100, Math.round(score))),
      matchedSkills: Array.isArray(raw.matchedSkills) ? raw.matchedSkills : [],
    },
  };
}

interface JobPayload {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budgetType: string;
  budgetMin: number;
  budgetMax: number;
  experienceLevel: string;
  deadline?: string;
}

export const jobsService = {
  list: async (params: JobListParams) => {
    const res = await apiClient.get<Job[]>(`/jobs${buildQuery(params)}`);
    return { jobs: res.data, meta: res.meta };
  },
  // Freelancer-only. The API accepts a limit of 1–30.
  recommended: async (limit = 10): Promise<RecommendedFeed> => {
    const safeLimit = Math.min(30, Math.max(1, limit));
    const res = await apiClient.get<any[]>(
      `/jobs/recommended${buildQuery({ limit: safeLimit })}`,
    );

    // This endpoint's meta is { limit, reason? } instead of page numbers.
    const reason = (res.meta as unknown as { reason?: string } | undefined)
      ?.reason;

    return {
      items: (res.data ?? [])
        .map(normalizeRecommended)
        .filter((item) => !!item.job),
      reason: isRecommendedReason(reason) ? reason : undefined,
    };
  },
  getById: async (jobId: string) => {
    const res = await apiClient.get<Job>(`/jobs/${jobId}`);
    return res.data;
  },
  create: async (payload: JobPayload) => {
    const res = await apiClient.post<Job>("/jobs", payload);
    return res.data;
  },
  update: async (jobId: string, payload: Partial<JobPayload>) => {
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
    const res = await apiClient.get<Job[]>(`/jobs/client/me${buildQuery(params)}`);
    return { jobs: res.data, meta: res.meta };
  },
  savedJobs: async (params: { page?: number; limit?: number } = {}) => {
    const res = await apiClient.get<any[]>(`/jobs/saved/me${buildQuery(params)}`);
    return { jobs: res.data.map(normalizeSavedJob), meta: res.meta };
  },
  save: async (jobId: string) => {
    await apiClient.post<void>(`/jobs/${jobId}/save`);
  },
  unsave: async (jobId: string) => {
    await apiClient.delete<void>(`/jobs/${jobId}/save`);
  },
};