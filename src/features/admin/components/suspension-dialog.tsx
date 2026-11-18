"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSetUserSuspension } from "@/hooks/use-admin";
import { ApiError } from "@/lib/api-client";
import type { AdminUser } from "@/types/admin";

const REASON_MAX = 500;

export interface SuspensionTarget {
  user: AdminUser;
  // true = suspend the account, false = restore access
  suspend: boolean;
}

interface SuspensionDialogProps {
  target: SuspensionTarget | null;
  onClose: () => void;
}

export function SuspensionDialog({ target, onClose }: SuspensionDialogProps) {
  return (
    <Dialog
      open={!!target}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={
        target
          ? target.suspend
            ? `Suspend ${target.user.name}?`
            : `Restore ${target.user.name}?`
          : ""
      }
    >
      {/* The Dialog only renders its children while open, so the note starts
          empty every time. */}
      {target && <SuspensionForm target={target} onDone={onClose} />}
    </Dialog>
  );
}

function SuspensionForm({
  target,
  onDone,
}: {
  target: SuspensionTarget;
  onDone: () => void;
}) {
  const setSuspension = useSetUserSuspension();
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const { user, suspend } = target;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReasonError(null);

    try {
      await setSuspension.mutateAsync({
        userId: user.id,
        suspended: suspend,
        reason: reason.trim() || undefined,
      });
      toast.success(
        suspend
          ? `${user.name} has been suspended.`
          : `${user.name}'s access was restored.`,
      );
      onDone();
    } catch (error) {
      // Other failures (an admin account, a missing user) are toasted globally.
      if (error instanceof ApiError && error.errors) {
        setReasonError(error.errors.reason?.[0] ?? null);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {suspend ? (
        <Alert variant="warning">
          {user.name} won&apos;t be able to log in or use Nexora until you
          restore their access. They&apos;ll see an &quot;Account
          suspended&quot; screen. You can undo this at any time.
        </Alert>
      ) : (
        <Alert variant="info">
          {user.name} will be able to log in and use Nexora again right away.
        </Alert>
      )}

      <div>
        <Label htmlFor="suspension-reason">Note (optional)</Label>
        <Textarea
          id="suspension-reason"
          rows={3}
          maxLength={REASON_MAX}
          placeholder={
            suspend
              ? "Why are you suspending this account?"
              : "Why is access being restored?"
          }
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="mt-1 flex items-start justify-between gap-3">
          {reasonError ? (
            <p className="text-status-error text-xs">{reasonError}</p>
          ) : (
            <span className="text-text-secondary text-xs">
              Recorded with this action.
            </span>
          )}
          <span className="text-text-secondary shrink-0 text-xs">
            {reason.length}/{REASON_MAX}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          variant={suspend ? "destructive" : "primary"}
          isLoading={setSuspension.isPending}
        >
          {suspend ? "Suspend account" : "Restore access"}
        </Button>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
