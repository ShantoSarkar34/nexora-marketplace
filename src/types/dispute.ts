import type {
  ContractStatus,
  DisputeResolution,
  DisputeStatus,
  RefundStatus,
} from "@/types/enums";

export interface DisputeParty {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface DisputeContract {
  id: string;
  status: ContractStatus;
  agreedBudget: number;
  job: { id: string; title: string };
  client: DisputeParty;
  freelancer: DisputeParty;
}

export interface Dispute {
  id: string;
  contractId: string;
  status: DisputeStatus;
  reason: string;
  // The contract status to return to if the dispute is withdrawn or closed
  // with no action.
  previousContractStatus?: ContractStatus | null;
  resolution?: DisputeResolution | null;
  resolutionNote?: string | null;
  refundStatus?: RefundStatus | null;
  resolvedAt?: string | null;
  createdAt: string;
  openedBy: DisputeParty;
  contract: DisputeContract;
  // Only admins receive these two.
  resolvedBy?: DisputeParty | null;
  refund?: {
    stripeRefundId?: string | null;
    error?: string | null;
  } | null;
}
