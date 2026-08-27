"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-client";
import { authService } from "@/services/auth";

export const authQueryKey = ["auth", "me"] as const;

export function useAuth() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: authQueryKey,
    queryFn: authService.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
    meta: { silent: true },
  });

  const isUnauthenticated =
    query.isError &&
    query.error instanceof ApiError &&
    query.error.status === 401;

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    isUnauthenticated,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: authQueryKey }),
    clear: () => queryClient.setQueryData(authQueryKey, null),
  };
}
