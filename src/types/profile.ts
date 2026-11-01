import type { Availability, CompanySize, ExperienceLevel } from "@/types/enums";

export interface SkillRelation {
  id: string;
  skillId: string;
  skill: {
    id: string;
    name: string;
  };
}

export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  projectUrl?: string;
  imageUrl?: string;
}

export interface ProfileUser {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  user: ProfileUser;
  title: string;
  bio: string;
  hourlyRate: number;
  experienceLevel?: ExperienceLevel | null;
  availability?: Availability | null;
  completionPercentage: number;
  skills: Skill[];
  experience: Experience[];
  portfolio: PortfolioItem[];
}

export interface ClientProfile {
  id: string;
  userId: string;
  companyName?: string;
  industry?: string;
  companySize?: CompanySize | null;
  website?: string;
  about?: string;
  location?: string;
  foundedYear?: number;
  linkedinUrl?: string;
  twitterUrl?: string;
  user?: ProfileUser;
}