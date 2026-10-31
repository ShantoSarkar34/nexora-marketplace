import { apiClient } from "@/lib/api-client";
import type {
  ClientBasicsValues,
  ExperienceInput,
  FreelancerBasicsValues,
  PortfolioInput,
} from "@/features/profile/schemas";
import type { Availability, ExperienceLevel } from "@/types/enums";
import type {
  ClientProfile,
  Experience,
  FreelancerProfile,
  PortfolioItem,
} from "@/types/profile";

export interface FreelancerListItem {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
  title: string;
  bio: string;
  hourlyRate: number;
  experienceLevel?: ExperienceLevel | null;
  availability?: Availability | null;
  skills: { id: string; skill: { id: string; name: string } }[];
  averageRating: number;
  totalReviews: number;
  completionPercentage: number;
}

function normalizeListItem(raw: any): FreelancerListItem {
  return {
    id: raw.id ?? raw.userId,
    userId: raw.userId,
    user: raw.user ?? {
      id: raw.userId,
      name: raw.name ?? "",
      imageUrl: raw.imageUrl ?? null,
    },
    title: raw.title ?? "",
    bio: raw.bio ?? "",
    hourlyRate: raw.hourlyRate ?? 0,
    experienceLevel: raw.experienceLevel ?? null,
    availability: raw.availability ?? null,
    skills: (raw.skills ?? []).map((s: any) => ({
      id: s.id,
      skill: {
        id: s.skill?.id ?? s.id,
        name: s.skill?.name ?? s.name ?? "",
      },
    })),
    averageRating: raw.averageRating ?? 0,
    totalReviews: raw.totalReviews ?? 0,
    completionPercentage: raw.completionPercentage ?? 0,
  };
}

function monthToIso(month: string) {
  return new Date(`${month}-01T00:00:00.000Z`).toISOString();
}

function isoToMonth(value: string) {
  return value.slice(0, 7);
}

function normalizeExperience(raw: any): Experience {
  return {
    id: raw.id,
    title: raw.title ?? "",
    company: raw.company ?? "",
    startDate: raw.startDate ? isoToMonth(raw.startDate) : "",
    endDate: raw.endDate ? isoToMonth(raw.endDate) : null,
    isCurrent: !!raw.isCurrent,
    description: raw.description ?? undefined,
  };
}

function normalizeFreelancerProfile(raw: any): FreelancerProfile {
  return {
    id: raw.id,
    userId: raw.userId,
    user: raw.user ?? {
      id: raw.userId,
      name: raw.name ?? "",
      imageUrl: raw.imageUrl ?? null,
    },
    title: raw.title ?? "",
    bio: raw.bio ?? "",
    hourlyRate: raw.hourlyRate ?? 0,
    completionPercentage: raw.completionPercentage ?? 0,
    skills: (raw.skills ?? []).map((s: any) => ({
      id: s.skillId ?? s.skill?.id ?? s.id,
      name: s.skill?.name ?? s.name ?? "",
    })),
    // The backend uses plural keys for these two.
    experience: (raw.experiences ?? raw.experience ?? []).map(
      normalizeExperience,
    ),
    portfolio: raw.portfolios ?? raw.portfolio ?? [],
  };
}

export const freelancerProfileService = {
  getFeaturedTalent: async (page = 1, limit = 6) => {
    const res = await apiClient.get<any[]>(
      `/profiles/freelancer?sortBy=rating&page=${page}&limit=${limit}`,
    );
    return { freelancers: res.data.map(normalizeListItem), meta: res.meta };
  },
  getMe: async () => {
    const res = await apiClient.get<any>("/profiles/freelancer/me");
    return normalizeFreelancerProfile(res.data);
  },
  create: async (payload: FreelancerBasicsValues) => {
    // `name` belongs to the user account, not the freelancer profile.
    const { name: _name, ...profileFields } = payload;
    const res = await apiClient.post<any>(
      "/profiles/freelancer",
      profileFields,
    );
    return normalizeFreelancerProfile(res.data);
  },
  update: async (payload: Partial<FreelancerBasicsValues>) => {
    const { name: _name, ...profileFields } = payload;
    const res = await apiClient.patch<any>(
      "/profiles/freelancer/me",
      profileFields,
    );
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
    const { startDate, endDate, isCurrent, description, ...rest } = payload;
    const res = await apiClient.post<any>("/profiles/freelancer/experience", {
      ...rest,
      startDate: monthToIso(startDate),
      isCurrent: !!isCurrent,
      // A current role has no end date.
      ...(!isCurrent && endDate ? { endDate: monthToIso(endDate) } : {}),
      ...(description?.trim() ? { description: description.trim() } : {}),
    });
    return normalizeExperience(res.data);
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
      name: res.data.name as string,
      imageUrl: (res.data.imageUrl ?? undefined) as string | undefined,
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
    const res = await apiClient.get<
      ClientProfile & { name: string; imageUrl?: string }
    >(`/profiles/client/${userId}`);
    return res.data;
  },
};
