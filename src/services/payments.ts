import { apiClient } from "@/lib/api-client";
import type {
  CheckoutResponse,
  Earnings,
  EarningsTransaction,
  Payment,
  Spending,
} from "@/types/payment";
import type { PaymentStatus } from "@/types/enums";

function buildQuery(params: object) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function normalizeEarnings(raw: any): Earnings {
  return {
    totalEarned: raw.totalEarned ?? 0,
    inEscrow: raw.inEscrow ?? 0,
    platformFeesPaid: raw.platformFeesPaid ?? 0,
    completedContracts: raw.completedContracts ?? 0,
  };
}

function normalizeTransaction(raw: any): EarningsTransaction {
  const client = raw.client ?? {};
  return {
    id: raw.id,
    contractId: raw.contractId,
    jobTitle: raw.jobTitle ?? "Untitled job",
    client: {
      id: client.id ?? "",
      name: client.name ?? "Unknown client",
      imageUrl: client.imageUrl ?? null,
    },
    gross: raw.gross ?? 0,
    feePercent: raw.feePercent ?? 0,
    fee: raw.fee ?? 0,
    net: raw.net ?? 0,
    contractStatus: raw.contractStatus,
    paidAt: raw.paidAt ?? null,
    completedAt: raw.completedAt ?? null,
  };
}

function normalizeSpending(raw: any): Spending {
  return {
    totalSpent: raw.totalSpent ?? 0,
    inEscrow: raw.inEscrow ?? 0,
    completedContracts: raw.completedContracts ?? 0,
  };
}

export const paymentsService = {
  createCheckout: async (contractId: string) => {
    const res = await apiClient.post<CheckoutResponse>(
      `/payments/contract/${contractId}/checkout`,
    );
    return res.data;
  },
  verifySession: async (sessionId: string) => {
    const res = await apiClient.get<Payment>(`/payments/verify/${sessionId}`);
    return res.data;
  },
  getForContract: async (contractId: string) => {
    const res = await apiClient.get<Payment>(
      `/payments/contract/${contractId}`,
    );
    return res.data;
  },
  myPayments: async (
    params: { status?: PaymentStatus; page?: number; limit?: number } = {},
  ) => {
    const res = await apiClient.get<Payment[]>(
      `/payments/me${buildQuery(params)}`,
    );
    return { payments: res.data, meta: res.meta };
  },

  // Freelancer
  earnings: async () => {
    const res = await apiClient.get<any>("/payments/earnings/me");
    return normalizeEarnings(res.data);
  },
  earningsTransactions: async (
    params: { page?: number; limit?: number } = {},
  ) => {
    const res = await apiClient.get<any[]>(
      `/payments/earnings/me/transactions${buildQuery(params)}`,
    );
    return {
      transactions: res.data.map(normalizeTransaction),
      meta: res.meta,
    };
  },

  // Client
  spending: async () => {
    const res = await apiClient.get<any>("/payments/spending/me");
    return normalizeSpending(res.data);
  },
};
