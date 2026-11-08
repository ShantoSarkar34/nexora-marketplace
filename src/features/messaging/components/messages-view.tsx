"use client";

import { MessageSquare } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { ConversationList } from "@/features/messaging/components/conversation-list";
import { ConversationThread } from "@/features/messaging/components/conversation-thread";
import { useAuth } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/use-messaging";
import { cn } from "@/lib/utils";

interface MessagesViewProps {
  role: "CLIENT" | "FREELANCER";
  conversationId?: string;
}

export function MessagesView({ role, conversationId }: MessagesViewProps) {
  const { user } = useAuth();
  const basePath =
    role === "CLIENT" ? "/client/messages" : "/freelancer/messages";

  // 50 covers every conversation anyone is realistically active in. The thread
  // header reads the other person and the job from this list.
  const { data, isLoading, isError, refetch } = useConversations({ limit: 50 });

  if (!user) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const conversations = data?.conversations ?? [];
  const active = conversationId
    ? conversations.find((conversation) => conversation.id === conversationId)
    : undefined;

  return (
    <div className="border-border bg-surface rounded-card flex h-[calc(100dvh-6.5rem)] min-h-112 overflow-hidden border lg:h-[calc(100dvh-9rem)]">
      <h1 className="sr-only">Messages</h1>

      {/* On small screens only one pane shows: the list, or the open thread. */}
      <aside
        className={cn(
          "border-border w-full shrink-0 flex-col lg:w-80 lg:border-r",
          conversationId ? "hidden lg:flex" : "flex",
        )}
      >
        <ConversationList
          conversations={conversations}
          activeId={conversationId}
          basePath={basePath}
          myId={user.id}
          role={role}
          isLoading={isLoading}
          isError={isError && !data}
          onRetry={() => refetch()}
        />
      </aside>

      <section
        className={cn(
          "min-w-0 flex-1 flex-col",
          conversationId ? "flex" : "hidden lg:flex",
        )}
      >
        {conversationId ? (
          <ConversationThread
            key={conversationId}
            conversationId={conversationId}
            conversation={active}
            basePath={basePath}
            myId={user.id}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="bg-surface-muted text-text-secondary flex h-14 w-14 items-center justify-center rounded-full">
              <MessageSquare className="h-7 w-7" />
            </div>
            <p className="text-text-primary text-sm font-medium">
              Select a conversation
            </p>
            <p className="text-text-secondary text-sm">
              Choose one from the list to read and reply.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
