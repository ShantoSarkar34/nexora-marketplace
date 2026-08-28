"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-client";
import { clientProfileService } from "@/services/profile";
import type { ClientBasicsValues } from "@/features/profile/schemas";

const queryKey = ["client-profile", "me"] as const;

export function useClientProfile() {
  const query = useQuery({
    queryKey,
    queryFn: clientProfileService.getMe,
    retry: false,
    meta: { silent: true },
  });

  const notFound =
    query.isError &&
    query.error instanceof ApiError &&
    query.error.status === 404;

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    notFound,
    refetch: query.refetch,
  };
}

export function useCreateClientProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ClientBasicsValues) =>
      clientProfileService.create(payload),
    onSuccess: (data) => qc.setQueryData(queryKey, data),
  });
}

export function useUpdateClientBasics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ClientBasicsValues>) =>
      clientProfileService.update(payload),
    onSuccess: (data) => qc.setQueryData(queryKey, data),
  });
}
