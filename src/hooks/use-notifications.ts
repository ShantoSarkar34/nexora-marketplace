"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationsService } from "@/services/notifications";

const UNREAD_COUNT_POLL_MS = 30_000; 

export function useUnreadCount(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationsService.unreadCount,
    enabled,
    refetchInterval: UNREAD_COUNT_POLL_MS,
    refetchOnWindowFocus: true, 
  });
}

export function useNotifications(
  params: { unreadOnly?: boolean; page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: ["notifications", "list", params],
    queryFn: () => notificationsService.list(params),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsService.markRead(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
