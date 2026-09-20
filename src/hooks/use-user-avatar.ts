"use client";

import { useQuery } from "@tanstack/react-query";

import {
  clientProfileService,
  freelancerProfileService,
} from "@/services/profile";

export function useUserAvatar(userId: string, role: "FREELANCER" | "CLIENT") {
  return useQuery({
    queryKey: ["user-avatar", role, userId],
    queryFn: async () => {
      if (role === "FREELANCER") {
        const profile = await freelancerProfileService.getPublic(userId);
        // return profile.imageUrl ?? null;
      }
      const profile = await clientProfileService.getPublic(userId);
    //   return profile.imageUrl ?? null;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, 
  });
}
