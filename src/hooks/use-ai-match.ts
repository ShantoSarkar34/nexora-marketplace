"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-client";
import { aiMatchService } from "@/services/ai-match";

export function useRuleBasedMatch(jobId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["ai-match", "rule-based", jobId],
    queryFn: () => aiMatchService.getRuleBased(jobId),
    enabled: enabled && !!jobId,
  });
}

export function useSavedAnalysis(jobId: string, enabled: boolean) {
  const query = useQuery({
    queryKey: ["ai-match", "analysis", jobId],
    queryFn: () => aiMatchService.getSavedAnalysis(jobId),
    enabled: enabled && !!jobId,
    retry: false,
    meta: { silent: true }, // 404 just means "not analyzed yet"
  });

  const notFound =
    query.isError &&
    query.error instanceof ApiError &&
    query.error.status === 404;

  return { analysis: query.data ?? null, isLoading: query.isLoading, notFound };
}

export function useAnalyzeJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => aiMatchService.analyze(jobId),
    onSuccess: (data, jobId) => {
      qc.setQueryData(["ai-match", "analysis", jobId], data);
    },
  });
}
