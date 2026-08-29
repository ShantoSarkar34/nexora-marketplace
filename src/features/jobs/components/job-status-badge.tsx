import { Badge } from "@/components/ui/badge";
import { jobStatusLabels } from "@/types/enums";
import type { JobStatus } from "@/types/enums";

const variantMap: Record<
  JobStatus,
  "success" | "neutral" | "warning" | "brand" | "error"
> = {
  DRAFT: "warning",
  OPEN: "success",
  IN_PROGRESS: "brand",
  COMPLETED: "neutral",
  CANCELLED: "error",
  CLOSED: "neutral",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge variant={variantMap[status]}>{jobStatusLabels[status]}</Badge>;
}
