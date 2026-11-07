import type { InvitationJob } from "@/types/invitation";

export function formatInvitationBudget(
  job: Pick<InvitationJob, "budgetMin" | "budgetMax" | "budgetType">,
) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const range = `${formatter.format(job.budgetMin)} – ${formatter.format(job.budgetMax)}`;
  return job.budgetType === "HOURLY" ? `${range}/hr` : range;
}
