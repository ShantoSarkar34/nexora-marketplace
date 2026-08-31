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

function normalizeFreelancerProfile(raw: FreelancerProfile): FreelancerProfile {
  return {
    ...raw,
    skills: raw.skills ?? [],
    experience: raw.experience ?? [],
    portfolio: raw.portfolio ?? [],
  };
}

export const freelancerProfileService = {
  getMe: async () => {
    const res = await apiClient.get<FreelancerProfile>(
      "/profiles/freelancer/me",
    );
    return normalizeFreelancerProfile(res.data);
  },
  create: async (payload: FreelancerBasicsValues) => {
    const res = await apiClient.post<FreelancerProfile>(
      "/profiles/freelancer",
      payload,
    );
    return normalizeFreelancerProfile(res.data);
  },
  update: async (payload: Partial<FreelancerBasicsValues>) => {
    const res = await apiClient.patch<FreelancerProfile>(
      "/profiles/freelancer/me",
      payload,
    );
    return normalizeFreelancerProfile(res.data);
  },
  addSkill: async (name: string) => {
    const res = await apiClient.post<Skill>("/profiles/freelancer/skills", {
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
    const res = await apiClient.get<
      FreelancerProfile & { name: string; avatarInitials?: string }
    >(`/profiles/freelancer/${userId}`);
    return {
      ...res.data,
      skills: res.data.skills ?? [],
      experience: res.data.experience ?? [],
      portfolio: res.data.portfolio ?? [],
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
