"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { dashboardService } from "@/services/dashboard";

export function useFreelancerDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboard", "freelancer", user?.id],
    queryFn: dashboardService.freelancer,
    enabled: user?.role === "FREELANCER",
    // Refetch every time the dashboard opens and when you return to the tab,
    // so the numbers never lag behind what you just did elsewhere.
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useClientDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboard", "client", user?.id],
    queryFn: dashboardService.client,
    enabled: user?.role === "CLIENT",
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}