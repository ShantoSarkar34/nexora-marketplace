"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, Lock, MessageSquare } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MessageComposer } from "@/features/messaging/components/message-composer";
import {
  DELETED_USER_NAME,
  formatDayLabel,
  formatMessageTime,
  isSameDay,
} from "@/features/messaging/utils";
import {
  useLoadOlderMessages,
  useMarkConversationRead,
  useSendMessage,
  useThread,
  useThreadPolling,
} from "@/hooks/use-messaging";
import { usePageVisible } from "@/hooks/use-page-visible";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { ConversationPreview, Message } from "@/types/messaging";

const EMPTY_MESSAGES: Message[] = [];
// How close to the bottom still counts as "reading the latest messages".
const NEAR_BOTTOM_PX = 120;

interface ConversationThreadProps {
  conversationId: string;
  // From the inbox list. Undefined while it loads or when the conversation
  // isn't among the 50 most recent.
  conversation?: ConversationPreview;
  basePath: string;
  myId: string;
}

export function ConversationThread({
  conversationId,
  conversation,
  basePath,
  myId,
}: ConversationThreadProps) {
  const thread = useThread(conversationId);
  const send = useSendMessage(conversationId);
  const loadOlder = useLoadOlderMessages(conversationId);
  const { mutate: markRead } = useMarkConversationRead(conversationId);
  useThreadPolling(conversationId, !!thread.data);
  const isVisible = usePageVisible();

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const prevLastIdRef = useRef<string | null>(null);
  const prependRef = useRef<{ height: number } | null>(null);
  const lastMarkedRef = useRef<string | null>(null);
  const [showNewPill, setShowNewPill] = useState(false);
  const [locked, setLocked] = useState(false);

  const messages = thread.data?.messages ?? EMPTY_MESSAGES;
  const hasMore = thread.data?.hasMore ?? false;

  const otherUser = conversation?.otherUser;
  const otherDeleted = otherUser?.name === DELETED_USER_NAME;
  const readOnlyText = otherDeleted
    ? "This account is no longer available, so this conversation is read-only."
    : locked
      ? "You can't send messages in this conversation right now."
      : null;

  const profileHref =
    otherUser && !otherDeleted && otherUser.id
      ? otherUser.role === "CLIENT"
        ? `/clients/${otherUser.id}`
        : `/freelancers/${otherUser.id}`
      : null;

  // Keep the reading position as messages arrive:
  //  - first load: jump to the newest message
  //  - older messages added above: keep the message that was on screen in place
  //  - a new message at the bottom: follow it if the reader is at the bottom
  //    (or sent it), otherwise offer a "New messages" button
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const newest = messages[messages.length - 1];
    if (!el || !newest) return;

    if (prependRef.current) {
      el.scrollTop += el.scrollHeight - prependRef.current.height;
      prependRef.current = null;
    } else if (prevLastIdRef.current === null) {
      el.scrollTop = el.scrollHeight;
    } else if (newest.id !== prevLastIdRef.current) {
      if (newest.senderId === myId || stickToBottomRef.current) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } else {
        setShowNewPill(true);
      }
    }

    prevLastIdRef.current = newest.id;
  }, [messages, myId]);

  // Tell the server we've read the other person's messages, once per new one
  // and only while the tab is actually visible.
  const latestUnreadFromOtherId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message && message.senderId !== myId && !message.readAt) {
        return message.id;
      }
    }
    return null;
  }, [messages, myId]);

  useEffect(() => {
    if (!latestUnreadFromOtherId || !isVisible) return;
    if (latestUnreadFromOtherId === lastMarkedRef.current) return;
    lastMarkedRef.current = latestUnreadFromOtherId;
    markRead();
  }, [latestUnreadFromOtherId, isVisible, markRead]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distance < NEAR_BOTTOM_PX;
    if (distance < NEAR_BOTTOM_PX) setShowNewPill(false);
  }

  function scrollToBottom() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setShowNewPill(false);
  }

  async function handleLoadOlder() {
    const el = scrollRef.current;
    if (el) prependRef.current = { height: el.scrollHeight };
    try {
      await loadOlder.mutateAsync();
    } catch {
      // The failure is toasted globally; nothing was added above.
      prependRef.current = null;
    }
  }

  async function handleSend(body: string) {
    try {
      await send.mutateAsync(body);
      return true;
    } catch (error) {
      // A 400 with no field errors means the server won't take messages in
      // this conversation (for example a suspended participant). The reason
      // is already toasted globally.
      if (error instanceof ApiError && error.status === 400 && !error.errors) {
        setLocked(true);
      }
      return false;
    }
  }

  return (
    <>
      <header className="border-border flex items-center gap-3 border-b px-4 py-3">
        <Link
          href={basePath}
          aria-label="Back to conversations"
          className="text-text-secondary hover:bg-surface-muted -ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {otherUser ? (
          <>
            <Avatar
              name={otherUser.name}
              imageUrl={otherUser.imageUrl}
              accent={otherUser.role === "CLIENT" ? "client" : "freelancer"}
            />
            <div className="min-w-0">
              {profileHref ? (
                <Link
                  href={profileHref}
                  className="text-text-primary block truncate text-sm font-semibold hover:underline"
                >
                  {otherUser.name}
                </Link>
              ) : (
                <p className="text-text-primary truncate text-sm font-semibold">
                  {otherUser.name}
                </p>
              )}
              {conversation && (
                <Link
                  href={`/jobs/${conversation.job.id}`}
                  className="text-text-secondary hover:text-brand-600 block truncate text-xs"
                >
                  {conversation.job.title}
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-text-primary text-sm font-semibold">
            Conversation
          </p>
        )}
      </header>

      {thread.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : thread.isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-text-primary text-sm font-medium">
            We couldn&apos;t open this conversation.
          </p>
          <p className="text-text-secondary text-sm">
            It may not exist, or you may not be a participant.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => thread.refetch()}>
              Try again
            </Button>
            <Link href={basePath}>
              <Button size="sm" variant="secondary">
                Back to messages
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex min-h-0 flex-1 flex-col">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              role="log"
              aria-live="polite"
              className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
            >
              {hasMore && (
                <div className="mb-3 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadOlder}
                    isLoading={loadOlder.isPending}
                  >
                    Load earlier messages
                  </Button>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <div className="bg-surface-muted text-text-secondary flex h-12 w-12 items-center justify-center rounded-full">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <p className="text-text-primary text-sm font-medium">
                    No messages yet
                  </p>
                  <p className="text-text-secondary max-w-xs text-sm">
                    {otherUser
                      ? `Say hello to ${otherUser.name}. Messages about this job will appear here.`
                      : "Send the first message to start the conversation."}
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const previous = messages[index - 1];
                  const startsNewDay =
                    !previous ||
                    !isSameDay(previous.createdAt, message.createdAt);
                  const startsCluster =
                    startsNewDay || previous.senderId !== message.senderId;
                  const mine = message.senderId === myId;

                  return (
                    <div key={message.id}>
                      {startsNewDay && (
                        <div className="my-4 flex justify-center">
                          <span className="bg-surface-muted text-text-secondary rounded-full px-3 py-1 text-xs">
                            {formatDayLabel(message.createdAt)}
                          </span>
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex",
                          mine ? "justify-end" : "justify-start",
                          startsCluster && !startsNewDay ? "mt-3" : "mt-1",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm sm:max-w-[75%]",
                            mine
                              ? "bg-brand-600 rounded-br-md text-white"
                              : "bg-surface-muted text-text-primary rounded-bl-md",
                          )}
                        >
                          <p className="wrap-break-word whitespace-pre-wrap">
                            {message.body}
                          </p>
                          <span
                            className={cn(
                              "mt-1 block text-[10px]",
                              mine ? "text-white/70" : "text-text-secondary",
                            )}
                          >
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {showNewPill && (
              <button
                type="button"
                onClick={scrollToBottom}
                className="bg-brand-600 absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-lg"
              >
                <ArrowDown className="h-3.5 w-3.5" />
                New messages
              </button>
            )}
          </div>

          {readOnlyText ? (
            <div className="border-border bg-surface-muted text-text-secondary flex items-center gap-2 border-t px-4 py-3 text-sm">
              <Lock className="h-4 w-4 shrink-0" />
              {readOnlyText}
            </div>
          ) : (
            <MessageComposer onSend={handleSend} isSending={send.isPending} />
          )}
        </>
      )}
    </>
  );
}
