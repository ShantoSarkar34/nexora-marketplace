"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { jobsService } from "@/services/jobs";

export function useRecommendedJobs(limit = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["jobs", "list", "recommended", user?.id, limit],
    queryFn: () => jobsService.recommended(limit),
    enabled: user?.role === "FREELANCER",
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
