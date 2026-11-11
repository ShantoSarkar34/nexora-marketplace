"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { paymentsService } from "@/services/payments";
import type { PaymentStatus } from "@/types/enums";

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (contractId: string) =>
      paymentsService.createCheckout(contractId),
  });
}

export function usePaymentForContract(
  contractId: string,
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: ["payments", "contract", contractId],
    queryFn: () => paymentsService.getForContract(contractId),
    enabled: !!contractId,
    refetchInterval: options?.refetchInterval,
  });
}

export function useMyPayments(
  params: {
    status?: PaymentStatus | "ALL";
    page?: number;
    limit?: number;
  } = {},
) {
  const { status, ...rest } = params;
  return useQuery({
    queryKey: ["payments", "mine", params],
    queryFn: () =>
      paymentsService.myPayments({
        ...rest,
        status: status && status !== "ALL" ? status : undefined,
      }),
    placeholderData: keepPreviousData,
  });
}

// Freelancer-only.
export function useEarnings() {
  return useQuery({
    queryKey: ["payments", "earnings"],
    queryFn: paymentsService.earnings,
  });
}

// Freelancer-only.
export function useEarningsTransactions(
  params: { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: ["payments", "earnings", "transactions", params],
    queryFn: () => paymentsService.earningsTransactions(params),
    placeholderData: keepPreviousData,
  });
}

// Client-only.
export function useSpending() {
  return useQuery({
    queryKey: ["payments", "spending"],
    queryFn: paymentsService.spending,
  });
}
