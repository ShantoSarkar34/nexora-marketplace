import { apiClient } from "@/lib/api-client";
import type { ConversationPreview, Message } from "@/types/messaging";

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

function normalizeMessage(raw: any): Message {
  return {
    id: raw.id,
    conversationId: raw.conversationId,
    senderId: raw.senderId,
    body: raw.body ?? "",
    readAt: raw.readAt ?? null,
    createdAt: raw.createdAt,
  };
}

function normalizeConversation(raw: any): ConversationPreview {
  const job = raw.job ?? {};
  const other = raw.otherUser ?? {};
  const last = raw.lastMessage;

  return {
    id: raw.id,
    job: { id: job.id ?? raw.jobId ?? "", title: job.title ?? "Untitled job" },
    otherUser: {
      id: other.id ?? "",
      name: other.name ?? "Unknown user",
      imageUrl: other.imageUrl ?? null,
      role: other.role ?? "FREELANCER",
    },
    lastMessage: last
      ? {
          body: last.body ?? "",
          senderId: last.senderId,
          createdAt: last.createdAt,
        }
      : null,
    unreadCount: raw.unreadCount ?? 0,
    lastMessageAt: raw.lastMessageAt ?? last?.createdAt ?? null,
  };
}

// Message lists carry `meta: { hasMore }` instead of page numbers.
function readHasMore(meta: unknown): boolean {
  return !!(meta as { hasMore?: boolean } | undefined)?.hasMore;
}

export const messagingService = {
  listConversations: async (params: { page?: number; limit?: number } = {}) => {
    const res = await apiClient.get<any[]>(
      `/conversations/me${buildQuery(params)}`,
    );
    return {
      conversations: res.data.map(normalizeConversation),
      meta: res.meta,
    };
  },

  // Get-or-create. Used by the Message buttons in C8.
  openConversation: async (payload: { jobId: string; otherUserId: string }) => {
    const res = await apiClient.post<any>("/conversations", payload);
    return normalizeConversation(res.data);
  },

  // Returns messages oldest first. With no cursor it is the latest page;
  // `before` pages backwards and `after` returns only newer messages.
  getMessages: async (
    conversationId: string,
    params: { limit?: number; before?: string; after?: string } = {},
  ) => {
    const res = await apiClient.get<any[]>(
      `/conversations/${conversationId}/messages${buildQuery(params)}`,
    );
    return {
      messages: res.data.map(normalizeMessage),
      hasMore: readHasMore(res.meta),
    };
  },

  sendMessage: async (conversationId: string, body: string) => {
    const res = await apiClient.post<any>(
      `/conversations/${conversationId}/messages`,
      { body },
    );
    return normalizeMessage(res.data);
  },

  markRead: async (conversationId: string) => {
    await apiClient.patch<void>(`/conversations/${conversationId}/read`);
  },

  unreadCount: async () => {
    const res = await apiClient.get<{ unreadCount: number }>(
      "/messages/unread-count",
    );
    return res.data.unreadCount;
  },
};
