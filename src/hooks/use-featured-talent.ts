import { useQuery } from "@tanstack/react-query";
import { freelancerProfileService } from "@/services/profile";

export function useFeaturedTalent(page = 1, limit = 6) {
  return useQuery({
    queryKey: ["featured-talent", page, limit],
    queryFn: () => freelancerProfileService.getFeaturedTalent(page, limit),
  });
}
