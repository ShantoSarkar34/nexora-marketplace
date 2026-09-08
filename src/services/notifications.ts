import { apiClient } from "@/lib/api-client";
import type { AppNotification } from "@/types/notification";

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

export const notificationsService = {
  list: async (
    params: { unreadOnly?: boolean; page?: number; limit?: number } = {},
  ) => {
    const res = await apiClient.get<AppNotification[]>(
      `/notifications/me${buildQuery(params)}`,
    );
    return { notifications: res.data, meta: res.meta };
  },
  unreadCount: async () => {
    const res = await apiClient.get<{ unreadCount: number }>(
      "/notifications/unread-count",
    );
    return res.data.unreadCount;
  },
  markRead: async (notificationId: string) => {
    await apiClient.patch<void>(`/notifications/${notificationId}/read`);
  },
  markAllRead: async () => {
    await apiClient.patch<void>("/notifications/read-all");
  },
};
