import { apiClient } from "@/lib/api-client";
import type { CheckoutResponse, Payment } from "@/types/payment";
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

export const paymentsService = {
  createCheckout: async (contractId: string) => {
    const res = await apiClient.post<CheckoutResponse>(
      `/payments/contract/${contractId}/checkout`,
    );
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
};
