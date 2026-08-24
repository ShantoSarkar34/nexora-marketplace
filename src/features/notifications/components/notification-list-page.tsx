"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/lib/mock-data/notifications";
import type { AppNotification } from "@/types/notification";

export function NotificationListPage() {
  const [notifications, setNotifications] =
    useState<AppNotification[]>(mockNotifications);

  function markAllRead() {
    // Track B: replace with real API call -> services/notifications.ts:markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
            onClick={markAllRead}
            className="text-brand-600 flex items-center gap-1.5 text-sm font-medium"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title="No notifications"
          description="You'll see updates about your applications and contracts here."
        />
      ) : (
        <Card className="p-0">
          <div className="divide-border divide-y">
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "#"}
                onClick={() => markRead(n.id)}
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
      )}
    </div>
  );
}
