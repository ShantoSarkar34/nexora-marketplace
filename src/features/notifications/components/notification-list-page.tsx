"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/use-notifications";
import { getNotificationLink } from "@/features/notifications/utils";

const PAGE_SIZE = 15;

export function NotificationListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data: unreadCount = 0 } = useUnreadCount(!!user);
  const { data, isLoading } = useNotifications({ page, limit: PAGE_SIZE });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (!user) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const notifications = data?.notifications ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Notifications</h1>
          <p className="text-text-secondary mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="text-brand-600 flex items-center gap-1.5 text-sm font-medium disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title="No notifications"
          description="You'll see updates about your applications and contracts here."
        />
      ) : (
        <>
          <Card className="p-0">
            <div className="divide-border divide-y">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={getNotificationLink(n, user.role)}
                  onClick={() => {
                    if (!n.isRead) markRead.mutate(n.id);
                  }}
                  className={cn(
                    "hover:bg-surface-muted flex items-start gap-3 p-4",
                    !n.isRead && "bg-brand-50/50",
                  )}
                >
                  {!n.isRead && (
                    <span className="bg-brand-600 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                  )}
                  <div className={cn(n.isRead && "pl-3.5")}>
                    <p className="text-text-primary text-sm">{n.message}</p>
                    <p className="text-text-secondary mt-1 text-xs">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
