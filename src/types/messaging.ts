import type { UserRole } from "@/types/user";

export interface ConversationUser {
  id: string;
  name: string;
  imageUrl?: string | null;
  role: UserRole;
}

export interface LastMessage {
  body: string;
  senderId: string;
  createdAt: string;
}

export interface ConversationPreview {
  id: string;
  job: { id: string; title: string };
  otherUser: ConversationUser;
  lastMessage: LastMessage | null;
  unreadCount: number;
  lastMessageAt: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

// What the thread cache holds for one conversation.
export interface ThreadData {
  // Oldest first.
  messages: Message[];
  // True while older messages exist on the server.
  hasMore: boolean;
}