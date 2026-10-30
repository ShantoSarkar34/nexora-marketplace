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
} from "@/types/profile";

// The month picker gives "YYYY-MM", but the backend stores a real DateTime and
// only accepts a full ISO string. Convert on the way out...
function monthToIso(month: string) {
  return new Date(`${month}-01T00:00:00.000Z`).toISOString();
}

// ...and back on the way in, so the rest of the UI keeps working with "YYYY-MM".
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
    title: raw.title ?? "",
    bio: raw.bio ?? "",
    hourlyRate: raw.hourlyRate ?? 0,
    user: raw?.user,
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
