import type { PaymentStatus } from "@/types/enums";

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
