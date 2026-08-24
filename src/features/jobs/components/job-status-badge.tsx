import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/types/job";

const variantMap: Record<JobStatus, "success" | "neutral" | "warning"> = {
  OPEN: "success",
  CLOSED: "neutral",
  DRAFT: "warning",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}
