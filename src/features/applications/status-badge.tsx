import { Badge } from "@/components/ui/badge";
import { applicationStatusLabels } from "@/types/enums";
import type { ApplicationStatus } from "@/types/enums";

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
  return (
    <Badge variant={variantMap[status]}>
      {applicationStatusLabels[status]}
    </Badge>
  );
}
