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

export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string;
  bio: string;
  hourlyRate: number;
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
  companySize?: string;
  website?: string;
  about?: string;
}
