export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
export type PaymentMethod = "STRIPE" | "BKASH";

export interface Payment {
  id: string;
  contractId: string;
  jobTitle: string;
  freelancerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}
