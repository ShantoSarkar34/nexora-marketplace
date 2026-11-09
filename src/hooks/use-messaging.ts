"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { mergeMessages, sortMessages } from "@/features/messaging/utils";
import { authQueryKey, useAuth } from "@/hooks/use-auth";
import { ApiError, isSuspendedError } from "@/lib/api-client";
import { messagingService } from "@/services/messaging";
import type { ThreadData } from "@/types/messaging";
import type { AuthUser } from "@/types/user";

export const THREAD_PAGE_SIZE = 30;
const THREAD_POLL_MS = 4_000;
const INBOX_POLL_MS = 12_000;
const UNREAD_POLL_MS = 25_000;
// A thread left open for a long time can have many new messages waiting.
const MAX_CATCH_UP_PAGES = 10;

export const messagingKeys = {
  conversations: ["messaging", "conversations"] as const,
  thread: (conversationId: string) =>
    ["messaging", "thread", conversationId] as const,
  poll: (conversationId: string) =>
    ["messaging", "poll", conversationId] as const,
  unreadCount: ["messaging", "unread-count"] as const,
};

// Polling queries are silent (a flaky connection would otherwise toast every
// few seconds), so the two errors that matter are handled here instead.
function usePollingErrorGuard(error: unknown) {
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (isSuspendedError(error)) {
      router.replace("/suspended");
    } else if (error instanceof ApiError && error.status === 401) {
      qc.invalidateQueries({ queryKey: authQueryKey });
    }
  }, [error, router, qc]);
}

// `poll: false` is for pages that only need to look something up, such as a
// profile page checking whether a conversation already exists.
export function useConversations(
  params: { page?: number; limit?: number } = {},
  options: { poll?: boolean } = {},
) {
  const { poll = true } = options;
  const { user } = useAuth();

  const query = useQuery({
    queryKey: [...messagingKeys.conversations, user?.id, params],
    queryFn: () => messagingService.listConversations(params),
    enabled: !!user,
    placeholderData: keepPreviousData,
    refetchInterval: poll ? INBOX_POLL_MS : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: poll,
    retry: false,
    meta: { silent: true },
  });

  usePollingErrorGuard(query.error);
  return query;
}

// The most recent conversation with one person, if any. It reads the same
// inbox list the Messages page uses, so it adds no request of its own when
// that list is already cached.
export function useConversationWith(otherUserId: string) {
  const query = useConversations({ limit: 50 }, { poll: false });
  const conversation = otherUserId
    ? (query.data?.conversations.find(
        (item) => item.otherUser.id === otherUserId,
      ) ?? null)
    : null;

  return { conversation, isLoading: query.isLoading };
}

// Get-or-create a conversation about a job. Returns the existing one when
// there already is one.
export function useOpenConversation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { jobId: string; otherUserId: string }) =>
      messagingService.openConversation(payload),
    meta: {
      forbiddenMessage:
        "You can message this person once they've applied to the job, been invited to it, or have a contract with you on it.",
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: messagingKeys.conversations }),
  });
}

export function useMessagesUnreadCount(enabled = true) {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: [...messagingKeys.unreadCount, user?.id],
    queryFn: messagingService.unreadCount,
    enabled:
      enabled && (user?.role === "CLIENT" || user?.role === "FREELANCER"),
    refetchInterval: UNREAD_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
    meta: { silent: true },
  });

  usePollingErrorGuard(query.error);
  return query;
}

// The latest page of a thread. After this the cache is updated in place by
// polling, sending and "load earlier", so it never needs refetching by itself.
export function useThread(conversationId: string) {
  return useQuery({
    queryKey: messagingKeys.thread(conversationId),
    queryFn: async (): Promise<ThreadData> => {
      const page = await messagingService.getMessages(conversationId, {
        limit: THREAD_PAGE_SIZE,
      });
      return { messages: sortMessages(page.messages), hasMore: page.hasMore };
    },
    staleTime: Infinity,
    enabled: !!conversationId,
  });
}

// Fetches messages newer than the newest one we have and merges them into the
// thread cache. React Query pauses it while the tab is hidden.
export function useThreadPolling(conversationId: string, enabled: boolean) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: messagingKeys.poll(conversationId),
    queryFn: async () => {
      let received = 0;

      for (let attempt = 0; attempt < MAX_CATCH_UP_PAGES; attempt++) {
        const current = qc.getQueryData<ThreadData>(
          messagingKeys.thread(conversationId),
        );
        if (!current) break;

        const newestId = current.messages[current.messages.length - 1]?.id;
        const page = await messagingService.getMessages(
          conversationId,
          newestId ? { after: newestId } : { limit: THREAD_PAGE_SIZE },
        );
        if (page.messages.length === 0) break;

        qc.setQueryData<ThreadData>(
          messagingKeys.thread(conversationId),
          (old) =>
            old
              ? {
                  messages: mergeMessages(old.messages, page.messages),
                  // Only a latest-page load says anything about older messages.
                  hasMore: newestId ? old.hasMore : page.hasMore,
                }
              : old,
        );
        received += page.messages.length;

        // An empty thread was just filled with the latest page. Otherwise keep
        // going only while the server says more is waiting.
        if (!newestId || !page.hasMore) break;
      }

      return received;
    },
    enabled,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchInterval: THREAD_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    meta: { silent: true },
  });

  usePollingErrorGuard(query.error);
  return query;
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: string) =>
      messagingService.sendMessage(conversationId, body),
    meta: {
      rateLimitMessage:
        "You're sending messages too quickly. Please wait a moment and try again.",
    },
    onSuccess: (message) => {
      qc.setQueryData<ThreadData>(messagingKeys.thread(conversationId), (old) =>
        old
          ? { ...old, messages: mergeMessages(old.messages, [message]) }
          : old,
      );
      qc.invalidateQueries({ queryKey: messagingKeys.conversations });
    },
  });
}

export function useLoadOlderMessages(conversationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const current = qc.getQueryData<ThreadData>(
        messagingKeys.thread(conversationId),
      );
      const oldestId = current?.messages[0]?.id;
      if (!oldestId) return null;

      return messagingService.getMessages(conversationId, {
        before: oldestId,
        limit: THREAD_PAGE_SIZE,
      });
    },
    onSuccess: (page) => {
      if (!page) return;
      qc.setQueryData<ThreadData>(messagingKeys.thread(conversationId), (old) =>
        old
          ? {
              messages: mergeMessages(old.messages, page.messages),
              hasMore: page.hasMore,
            }
          : old,
      );
    },
  });
}

export function useMarkConversationRead(conversationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => messagingService.markRead(conversationId),
    // Background housekeeping, so it never toasts.
    meta: { silent: true },
    onSuccess: () => {
      const me = qc.getQueryData<AuthUser | null>(authQueryKey);
      const now = new Date().toISOString();

      // Reflect it locally so reopening the thread doesn't mark it read again.
      qc.setQueryData<ThreadData>(messagingKeys.thread(conversationId), (old) =>
        old
          ? {
              ...old,
              messages: old.messages.map((message) =>
                message.senderId !== me?.id && !message.readAt
                  ? { ...message, readAt: now }
                  : message,
              ),
            }
          : old,
      );
      qc.invalidateQueries({ queryKey: messagingKeys.conversations });
      qc.invalidateQueries({ queryKey: messagingKeys.unreadCount });
    },
  });
}