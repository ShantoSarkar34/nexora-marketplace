import { useQuery } from "@tanstack/react-query";

import { freelancerProfileService } from "@/services/profile";

export function useFreelancers(page = 1, limit = 6) {
  return useQuery({
    queryKey: ["freelancers", page, limit],
    queryFn: () => freelancerProfileService.getAll(page, limit),
  });
}
