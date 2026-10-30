import type {
  BudgetType,
  ExperienceLevel,
  JobCategory,
  JobStatus,
} from "@/types/enums";

export interface JobSkillRelation {
  id: string;
  jobId: string;
  skillId: string;
  skill: {
    id: string;
    name: string;
  };
}

export interface JobClient {
  id: string;
  name: string;
  imageUrl?: string | null;
  clientProfile?: { companyName?: string | null } | null;
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: JobCategory;
  budgetType: BudgetType;
  budgetMin: number;
  budgetMax: number;
  experienceLevel: ExperienceLevel;
  deadline?: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt?: string;
  skills: JobSkillRelation[];
  client?: JobClient;
  clientName: string;
  clientImageUrl?: string | null;
  companyName?: string | null;
  applicantCount: number;
  // Real values need credentials; logged-out requests get false.
  isSaved: boolean;
  hasApplied: boolean;
  // Only present on GET /jobs/saved/me.
  savedAt?: string;
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
