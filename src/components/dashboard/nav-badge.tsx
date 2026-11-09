"use client";

import { useMessagesUnreadCount } from "@/hooks/use-messaging";

export function NavBadge() {
  const { data: count = 0 } = useMessagesUnreadCount();

  if (count <= 0) return null;

  return (
    <span className="bg-brand-600 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white">
      {count > 99 ? "99+" : count}
      <span className="sr-only"> unread messages</span>
    </span>
  );
}
