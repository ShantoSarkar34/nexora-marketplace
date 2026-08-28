"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-client";
import { freelancerProfileService } from "@/services/profile";
import type {
  ExperienceInput,
  FreelancerBasicsValues,
  PortfolioInput,
} from "@/features/profile/schemas";

const queryKey = ["freelancer-profile", "me"] as const;

export function useFreelancerProfile() {
  const query = useQuery({
    queryKey,
    queryFn: freelancerProfileService.getMe,
    retry: false,
    meta: { silent: true }, // 404 = "no profile yet", not an error
  });

  const notFound =
    query.isError &&
    query.error instanceof ApiError &&
    query.error.status === 404;

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    notFound,
    refetch: query.refetch,
  };
}

export function useCreateFreelancerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FreelancerBasicsValues) =>
      freelancerProfileService.create(payload),
    onSuccess: (data) => qc.setQueryData(queryKey, data),
  });
}

export function useUpdateFreelancerBasics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<FreelancerBasicsValues>) =>
      freelancerProfileService.update(payload),
    onSuccess: (data) => qc.setQueryData(queryKey, data),
  });
}

export function useAddSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => freelancerProfileService.addSkill(name),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

export function useRemoveSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) =>
      freelancerProfileService.removeSkill(skillId),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

export function useAddExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExperienceInput) =>
      freelancerProfileService.addExperience(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

export function useRemoveExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (experienceId: string) =>
      freelancerProfileService.removeExperience(experienceId),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

export function useAddPortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PortfolioInput) =>
      freelancerProfileService.addPortfolio(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

export function useRemovePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (portfolioId: string) =>
      freelancerProfileService.removePortfolio(portfolioId),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}
