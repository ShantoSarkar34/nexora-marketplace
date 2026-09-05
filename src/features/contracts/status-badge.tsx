import { Badge } from "@/components/ui/badge";
import { contractStatusLabels } from "@/types/enums";
import type { ContractStatus } from "@/types/enums";

const variantMap: Record<
  ContractStatus,
  "warning" | "success" | "brand" | "neutral" | "error"
> = {
  PENDING: "warning",
  ACTIVE: "success",
  SUBMITTED: "brand",
  COMPLETED: "neutral",
  CANCELLED: "error",
  DISPUTED: "error",
};

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return (
    <Badge variant={variantMap[status]}>{contractStatusLabels[status]}</Badge>
  );
}
