import { Badge } from "@/components/ui/badge";
import { disputeStatusLabels, type DisputeStatus } from "@/types/enums";

const variantMap: Record<DisputeStatus, "warning" | "success" | "neutral"> = {
  OPEN: "warning",
  RESOLVED: "success",
  WITHDRAWN: "neutral",
};

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  return (
    <Badge variant={variantMap[status]}>{disputeStatusLabels[status]}</Badge>
  );
}
