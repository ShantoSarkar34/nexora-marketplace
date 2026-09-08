import { apiClient } from "@/lib/api-client";
import type {
  ClientBasicsValues,
  ExperienceInput,
  FreelancerBasicsValues,
  PortfolioInput,
} from "@/features/profile/schemas";
import type {
  ClientProfile,
  Experience,
  FreelancerProfile,
  PortfolioItem,
  Skill,
} from "@/types/profile";

function normalizeFreelancerProfile(raw: any): FreelancerProfile {
  return {
    id: raw.id,
    userId: raw.userId,
    title: raw.title ?? "",
    bio: raw.bio ?? "",
    hourlyRate: Number(raw.hourlyRate) || 0,
    completionPercentage: raw.completionPercentage ?? 0,
    skills: (raw.skills ?? []).map((s: any) => ({
      id: s.skillId ?? s.skill?.id ?? s.id,
      name: s.skill?.name ?? s.name ?? "",
    })),
    experience: raw.experiences ?? raw.experience ?? [],
    portfolio: raw.portfolios ?? raw.portfolio ?? [],
  };
}

export const freelancerProfileService = {
  getMe: async () => {
    const res = await apiClient.get<any>("/profiles/freelancer/me");
    return normalizeFreelancerProfile(res.data);
  },
  create: async (payload: FreelancerBasicsValues) => {
    const res = await apiClient.post<any>("/profiles/freelancer", payload);
    return normalizeFreelancerProfile(res.data);
  },
  update: async (payload: Partial<FreelancerBasicsValues>) => {
    const res = await apiClient.patch<any>("/profiles/freelancer/me", payload);
    return normalizeFreelancerProfile(res.data);
  },
  addSkill: async (name: string) => {
    const res = await apiClient.post<any>("/profiles/freelancer/skills", {
      name,
    });
    return res.data;
  },
  removeSkill: async (skillId: string) => {
    await apiClient.delete<void>(`/profiles/freelancer/skills/${skillId}`);
  },
  addExperience: async (payload: ExperienceInput) => {
    const res = await apiClient.post<Experience>(
      "/profiles/freelancer/experience",
      payload,
    );
    return res.data;
  },
  removeExperience: async (experienceId: string) => {
    await apiClient.delete<void>(
      `/profiles/freelancer/experience/${experienceId}`,
    );
  },
  addPortfolio: async (payload: PortfolioInput) => {
    const res = await apiClient.post<PortfolioItem>(
      "/profiles/freelancer/portfolio",
      payload,
    );
    return res.data;
  },
  removePortfolio: async (portfolioId: string) => {
    await apiClient.delete<void>(
      `/profiles/freelancer/portfolio/${portfolioId}`,
    );
  },
  getPublic: async (userId: string) => {
    const res = await apiClient.get<any>(`/profiles/freelancer/${userId}`);
    return {
      ...normalizeFreelancerProfile(res.data),
      name: res.data.name,
      avatarInitials: res.data.avatarInitials,
    };
  },
};

export const clientProfileService = {
  getMe: async () => {
    const res = await apiClient.get<ClientProfile>("/profiles/client/me");
    return res.data;
  },
  create: async (payload: ClientBasicsValues) => {
    const res = await apiClient.post<ClientProfile>(
      "/profiles/client",
      payload,
    );
    return res.data;
  },
  update: async (payload: Partial<ClientBasicsValues>) => {
    const res = await apiClient.patch<ClientProfile>(
      "/profiles/client/me",
      payload,
    );
    return res.data;
  },
  getPublic: async (userId: string) => {
    const res = await apiClient.get<ClientProfile & { name: string }>(
      `/profiles/client/${userId}`,
    );
    return res.data;
  },
};
