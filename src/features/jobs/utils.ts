import { budgetTypeLabels, jobCategoryLabels } from "@/types/enums";
import type { Job } from "@/types/job";

export function getJobSkillNames(job: Job): string[] {
  if (!Array.isArray(job.skills)) return [];
  return job.skills
    .map((s) => (typeof s === "string" ? s : s?.skill?.name))
    .filter((name): name is string => !!name);
}

export function formatBudget(job: Job) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const range = `${formatter.format(job.budgetMin)} – ${formatter.format(job.budgetMax)}`;
  return job.budgetType === "HOURLY" ? `${range}/hr` : range;
}

export function categoryLabel(job: Job) {
  return jobCategoryLabels[job.category] ?? job.category;
}

export function budgetTypeLabel(job: Job) {
  return budgetTypeLabels[job.budgetType] ?? job.budgetType;
}

export function timeAgo(isoDate: string) {
  const days = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Date(isoDate).toLocaleDateString();
}
