"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  freelancerProfileService,
  type FreelancerListParams,
} from "@/services/profile";

export function useFreelancerDirectory(params: FreelancerListParams) {
  return useQuery({
    queryKey: ["freelancers", "directory", params],
    queryFn: () => freelancerProfileService.listFreelancers(params),
    // Keep the old results on screen while the next page or filter loads.
    placeholderData: keepPreviousData,
  });
}
