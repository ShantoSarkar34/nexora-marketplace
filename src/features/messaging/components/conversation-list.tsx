"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";
import {
  conversationPreviewText,
  formatConversationTime,
} from "@/features/messaging/utils";
import { cn } from "@/lib/utils";
import type { ConversationPreview } from "@/types/messaging";

interface ConversationListProps {
  conversations: ConversationPreview[];
  activeId?: string;
  basePath: string;
  myId: string;
  role: "CLIENT" | "FREELANCER";
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function RowSkeleton() {
  return (
    <div className="border-border flex animate-pulse items-start gap-3 border-b px-4 py-3">
      <div className="bg-surface-muted h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="bg-surface-muted h-3.5 w-1/2 rounded" />
        <div className="bg-surface-muted h-3 w-2/3 rounded" />
        <div className="bg-surface-muted h-3 w-5/6 rounded" />
      </div>
    </div>
  );
}

export function ConversationList({
  conversations,
  activeId,
  basePath,
  myId,
  role,
  isLoading,
  isError,
  onRetry,
}: ConversationListProps) {
  return (
    <>
      <div className="border-border border-b px-4 py-3">
        <h2 className="text-text-primary text-base font-semibold">Messages</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : isError ? (
          <div className="px-4 py-10 text-center">
            <p className="text-text-secondary text-sm">
              We couldn&apos;t load your conversations.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              Try again
            </Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <div className="bg-surface-muted text-text-secondary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-text-primary mt-3 text-sm font-medium">
              No conversations yet
            </p>
            <p className="text-text-secondary mt-1 text-sm">
              {role === "CLIENT"
                ? "You can message a freelancer once they've applied to your job or accepted your invitation."
                : "You can message a client once you've applied to their job or they've invited you."}
            </p>
            <Link
              href={
                role === "CLIENT" ? "/client/applications" : "/freelancer/jobs"
              }
              className="mt-4 inline-block"
            >
              <Button size="sm" variant="secondary">
                {role === "CLIENT" ? "View applicants" : "Browse jobs"}
              </Button>
            </Link>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation.id === activeId;
            const hasUnread = conversation.unreadCount > 0;

            return (
              <Link
                key={conversation.id}
                href={`${basePath}/${conversation.id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "border-border hover:bg-surface-muted flex items-start gap-3 border-b px-4 py-3 transition-colors",
                  isActive && "bg-surface-muted",
                )}
              >
                <Avatar
                  name={conversation.otherUser.name}
                  imageUrl={conversation.otherUser.imageUrl}
                  accent={
                    conversation.otherUser.role === "CLIENT"
                      ? "client"
                      : "freelancer"
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={cn(
                        "text-text-primary truncate text-sm",
                        hasUnread ? "font-semibold" : "font-medium",
                      )}
                    >
                      {conversation.otherUser.name}
                    </p>
                    <span className="text-text-secondary shrink-0 text-xs">
                      {formatConversationTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-text-secondary truncate text-xs">
                    {conversation.job.title}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "truncate text-sm",
                        hasUnread ? "text-text-primary" : "text-text-secondary",
                      )}
                    >
                      {conversationPreviewText(conversation, myId)}
                    </p>
                    {hasUnread && (
                      <span className="bg-brand-600 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white">
                        {conversation.unreadCount > 99
                          ? "99+"
                          : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
