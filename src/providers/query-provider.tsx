"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { authQueryKey } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { handleApiError } from "@/lib/handle-api-error";

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export function QueryProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const [queryClient] = useState(() => {
    function goToLogin() {
      const current = pathnameRef.current ?? "";
      if (AUTH_PATHS.some((path) => current.startsWith(path))) return;
      router.push("/login");
    }

    function goToSuspended() {
      if (pathnameRef.current !== "/suspended") router.replace("/suspended");
    }

    const client: QueryClient = new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          if (query.meta?.silent) return;
          handleApiError(error, {
            source: "query",
            onUnauthorized: goToLogin,
            onSuspended: goToSuspended,
          });
        },
      }),
      mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
          if (mutation.meta?.silent) return;
          const rateLimit = mutation.meta?.rateLimitMessage;
          const forbidden = mutation.meta?.forbiddenMessage;
          handleApiError(error, {
            source: "mutation",
            rateLimitMessage:
              typeof rateLimit === "string" ? rateLimit : undefined,
            forbiddenMessage:
              typeof forbidden === "string" ? forbidden : undefined,
            onUnauthorized: () => {
              void client.invalidateQueries({ queryKey: authQueryKey });
            },
            onSuspended: goToSuspended,
          });
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            // 4xx errors won't fix themselves; retry once for network/5xx.
            if (
              error instanceof ApiError &&
              error.status >= 400 &&
              error.status < 500
            ) {
              return false;
            }
            return failureCount < 1;
          },
        },
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}