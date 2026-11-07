"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InviteToJobDialog } from "@/features/invitations/components/invite-to-job-dialog";
import { useAuth } from "@/hooks/use-auth";

interface InviteToJobButtonProps {
  freelancerId: string;
  freelancerName: string;
  defaultJobId?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function InviteToJobButton({
  freelancerId,
  freelancerName,
  defaultJobId,
  variant = "secondary",
  size = "md",
  className,
}: InviteToJobButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Only clients can invite, so everyone else sees nothing.
  if (user?.role !== "CLIENT") return null;

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        <UserPlus className="mr-1.5 h-4 w-4" />
        Invite to a job
      </Button>
      <InviteToJobDialog
        open={open}
        onOpenChange={setOpen}
        freelancerId={freelancerId}
        freelancerName={freelancerName}
        defaultJobId={defaultJobId}
      />
    </>
  );
}
