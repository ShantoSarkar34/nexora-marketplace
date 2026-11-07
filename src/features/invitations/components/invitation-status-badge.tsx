import { Badge } from "@/components/ui/badge";
import { invitationStatusLabels, type InvitationStatus } from "@/types/enums";

const variantMap: Record<
  InvitationStatus,
  "warning" | "success" | "error" | "neutral"
> = {
  PENDING: "warning",
  ACCEPTED: "success",
  DECLINED: "error",
  CANCELLED: "neutral",
  EXPIRED: "neutral",
};

export function InvitationStatusBadge({
  status,
}: {
  status: InvitationStatus;
}) {
  return (
    <Badge variant={variantMap[status]}>{invitationStatusLabels[status]}</Badge>
  );
}
