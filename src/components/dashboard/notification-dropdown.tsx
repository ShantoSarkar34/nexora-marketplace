"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { mockNotifications } from "@/lib/mock-data/notifications";
import type { AppNotification } from "@/types/notification";

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(mockNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    // Track B: replace with real API call -> services/notifications.ts:markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function markRead(id: string) {
    // Track B: replace with real API call -> services/notifications.ts:markRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Notifications"
        className="text-text-secondary hover:bg-surface-muted hover:text-text-primary relative flex h-9 w-9 items-center justify-center rounded-md"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="bg-status-error absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="border-border bg-surface absolute right-0 mt-2 w-80 overflow-hidden rounded-md border shadow-lg"
          >
            <div className="border-border flex items-center justify-between border-b px-3 py-2.5">
              <p className="text-text-primary text-sm font-medium">
                Notifications
              </p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-brand-600 flex items-center gap-1 text-xs font-medium"
                >
                  <Check className="h-3 w-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-text-secondary p-4 text-center text-sm">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link ?? "#"}
                    onClick={() => {
                      markRead(n.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "border-border hover:bg-surface-muted block border-b px-3 py-2.5 last:border-0",
                      !n.isRead && "bg-brand-50/50",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && (
                        <span className="bg-brand-600 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                      )}
                      <div className={cn(n.isRead && "pl-3.5")}>
                        <p className="text-text-primary text-sm">{n.message}</p>
                        <p className="text-text-secondary mt-0.5 text-xs">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
