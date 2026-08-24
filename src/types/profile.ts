export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string; // "2023-01"
  endDate: string | null; // null = current
  description: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface FreelancerProfile {
  name: string;
  title: string;
  bio: string;
  hourlyRate: number;
  location: string;
  skills: Skill[];
  experience: Experience[];
  portfolio: PortfolioItem[];
  avatarInitials: string;
}

export interface ClientProfile {
  name: string;
  companyName: string;
  companyDescription: string;
  industry: string;
  location: string;
  website?: string;
  avatarInitials: string;
}
