import type { BudgetType, ExperienceLevel, JobCategory, JobStatus } from "@/types/enums";

export interface JobSkillRelation {
  id: string;
  jobId: string;
  skillId: string;
  skill: {
    id: string;
    name: string;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  skills: JobSkillRelation[];
  budgetType: BudgetType;
  budgetMin: number;
  budgetMax: number;
  experienceLevel: ExperienceLevel;
  deadline?: string;
  status: JobStatus;
  clientId: string;
  clientName: string;
  applicantCount: number;
  createdAt: string;
  isSaved?: boolean;
}

export interface JobListParams {
  search?: string;
  category?: JobCategory;
  budgetType?: BudgetType;
  experienceLevel?: ExperienceLevel;
  minBudget?: number;
  maxBudget?: number;
  sortBy?: "newest" | "budget_asc" | "budget_desc";
  page?: number;
  limit?: number;
}