import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types/application";

const variantMap: Record<
  ApplicationStatus,
  "warning" | "brand" | "error" | "success" | "neutral"
> = {
  PENDING: "warning",
  SHORTLISTED: "brand",
  REJECTED: "error",
  HIRED: "success",
  WITHDRAWN: "neutral",
};

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}
