"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { notificationsService } from "@/services/notifications";

const UNREAD_COUNT_POLL_MS = 30_000;

export function useUnreadCount(enabled: boolean) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", "unread-count", user?.id],
    queryFn: notificationsService.unreadCount,
    enabled: enabled && !!user,
    refetchInterval: UNREAD_COUNT_POLL_MS,
    refetchOnWindowFocus: true,
  });
}

export function useNotifications(
  params: { unreadOnly?: boolean; page?: number; limit?: number } = {},
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", "list", user?.id, params],
    queryFn: () => notificationsService.list(params),
    enabled: !!user,
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
