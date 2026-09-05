import type { PaymentStatus } from "@/types/enums";

export interface Payment {
  id: string;
  contractId: string;
  jobTitle: string;
  freelancerName: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  payment: Payment;
}
