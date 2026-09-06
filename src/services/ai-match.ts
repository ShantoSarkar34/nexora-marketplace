import { apiClient } from "@/lib/api-client";
import type { AIAnalysis, RuleBasedMatch } from "@/types/ai-match";

function normalizeAnalysis(raw: any): AIAnalysis {
  return {
    matchScore: raw.matchScore ?? 0,
    strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
    missingSkills: Array.isArray(raw.missingSkills) ? raw.missingSkills : [],
    recommendation: raw.recommendation ?? "",
    updatedAt: raw.updatedAt ?? raw.createdAt ?? new Date().toISOString(),
  };
}

export const aiMatchService = {
  getRuleBased: async (jobId: string) => {
    const res = await apiClient.get<RuleBasedMatch>(
      `/ai-match/jobs/${jobId}/rule-based`,
    );
    return res.data;
  },
  analyze: async (jobId: string) => {
    const res = await apiClient.post<any>(`/ai-match/jobs/${jobId}/analyze`);
    return normalizeAnalysis(res.data);
  },
  getSavedAnalysis: async (jobId: string) => {
    const res = await apiClient.get<any>(`/ai-match/jobs/${jobId}/analysis`);
    return normalizeAnalysis(res.data);
  },
};
