import { Badge } from "@/components/ui/badge";
import { paymentStatusLabels } from "@/types/enums";
import type { PaymentStatus } from "@/types/enums";

const variantMap: Record<
  PaymentStatus,
  "success" | "warning" | "error" | "neutral" | "brand"
> = {
  PENDING: "warning",
  PROCESSING: "brand",
  SUCCESS: "success",
  FAILED: "error",
  CANCELLED: "neutral",
  REFUNDED: "neutral",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={variantMap[status]}>{paymentStatusLabels[status]}</Badge>
  );
}
