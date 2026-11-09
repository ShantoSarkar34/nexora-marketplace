"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useConversationWith } from "@/hooks/use-messaging";

interface ProfileMessageButtonProps {
  // The profile owner's user id.
  userId: string;
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

// A profile has no job, so it can only reopen a conversation that already
// exists. New conversations start from an application, invitation or contract.
// Renders nothing when there is no conversation with this person.
export function ProfileMessageButton({
  userId,
  label = "Message",
  variant = "secondary",
  size = "sm",
  className,
}: ProfileMessageButtonProps) {
  const { user } = useAuth();
  const { conversation } = useConversationWith(user ? userId : "");

  if (user?.role !== "CLIENT" && user?.role !== "FREELANCER") return null;
  if (user.id === userId || !conversation) return null;

  const basePath =
    user.role === "CLIENT" ? "/client/messages" : "/freelancer/messages";

  return (
    <Link href={`${basePath}/${conversation.id}`} className="inline-block">
      <Button variant={variant} size={size} className={className}>
        <MessageSquare className="mr-1.5 h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
