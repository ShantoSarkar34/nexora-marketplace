import type { Payment } from "@/types/payment";

// Track B: replace with GET /payments
export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    contractId: "contract-3",
    jobTitle: "Blog Content Sprint",
    freelancerName: "Sarah Khan",
    amount: 450,
    method: "STRIPE",
    status: "SUCCESS",
    createdAt: "2026-07-30",
  },
  {
    id: "pay-2",
    contractId: "contract-1",
    jobTitle: "Landing Page Design + Build",
    freelancerName: "Sarah Khan",
    amount: 450,
    method: "STRIPE",
    status: "SUCCESS",
    createdAt: "2026-08-12",
  },
];
