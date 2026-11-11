import type { ContractStatus, PaymentStatus } from "@/types/enums";

export interface Payment {
  id: string;
  contractId: string;
  payerId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  feePercent: number;
  feeAmount: number;
  netAmount: number;
  paidAt?: string | null;
  createdAt: string;
  jobTitle?: string;
  freelancerName?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  payment: Payment;
}

// GET /payments/earnings/me. Net of the platform fee.
export interface Earnings {
  totalEarned: number;
  inEscrow: number;
  platformFeesPaid: number;
  completedContracts: number;
}

// One row of GET /payments/earnings/me/transactions.
export interface EarningsTransaction {
  id: string;
  contractId: string;
  jobTitle: string;
  client: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
  gross: number;
  feePercent: number;
  fee: number;
  net: number;
  contractStatus: ContractStatus;
  paidAt?: string | null;
  completedAt?: string | null;
}

// GET /payments/spending/me. Gross amounts. A client's paid total is
// totalSpent + inEscrow.
export interface Spending {
  totalSpent: number;
  inEscrow: number;
  completedContracts: number;
}
