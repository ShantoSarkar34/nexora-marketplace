"use client";

import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useOpenConversation } from "@/hooks/use-messaging";

interface MessageButtonProps {
  // The job the two people have in common (an application, an invitation or a
  // contract). The API only allows a conversation about such a job.
  jobId: string;
  otherUserId: string;
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MessageButton({
  jobId,
  otherUserId,
  label = "Message",
  variant = "secondary",
  size = "md",
  className,
}: MessageButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const openConversation = useOpenConversation();

  if (user?.role !== "CLIENT" && user?.role !== "FREELANCER") return null;
  if (!jobId || !otherUserId || otherUserId === user.id) return null;

  const basePath =
    user.role === "CLIENT" ? "/client/messages" : "/freelancer/messages";

  async function handleClick() {
    try {
      const conversation = await openConversation.mutateAsync({
        jobId,
        otherUserId,
      });
      router.push(`${basePath}/${conversation.id}`);
    } catch {
      // toasted globally, with a friendly message for a 403
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      isLoading={openConversation.isPending}
    >
      <MessageSquare className="mr-1.5 h-4 w-4" />
      {label}
    </Button>
  );
}
