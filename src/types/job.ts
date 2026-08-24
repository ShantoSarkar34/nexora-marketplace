export type JobCategory =
  | "Web Development"
  | "Mobile Development"
  | "Design"
  | "Writing"
  | "Marketing"
  | "Data Science";

export type ExperienceLevel = "Entry" | "Intermediate" | "Expert";
export type JobStatus = "OPEN" | "CLOSED" | "DRAFT";
export type BudgetType = "FIXED" | "HOURLY";

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  skills: string[];
  budgetType: BudgetType;
  budgetMin: number;
  budgetMax: number;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  clientName: string;
  clientId: string;
  applicantCount: number;
  postedAt: string; // ISO date
}
