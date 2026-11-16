"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useWithdrawDispute } from "@/hooks/use-disputes";
import { contractStatusLabels } from "@/types/enums";
import type { Dispute } from "@/types/dispute";

export function WithdrawDisputeButton({
  dispute,
  size = "sm",
}: {
  dispute: Dispute;
  size?: "sm" | "md";
}) {
  const { user } = useAuth();
  const withdraw = useWithdrawDispute();
  const [open, setOpen] = useState(false);

  // Only the person who opened an open dispute can withdraw it.
  if (!user || dispute.status !== "OPEN" || dispute.openedBy.id !== user.id) {
    return null;
  }

  const previous = dispute.previousContractStatus
    ? contractStatusLabels[dispute.previousContractStatus]
    : null;

  async function handleWithdraw() {
    try {
      await withdraw.mutateAsync(dispute.id);
      toast.success("Dispute withdrawn.");
      setOpen(false);
    } catch {
      // toasted globally
    }
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        Withdraw dispute
      </Button>

      <Dialog open={open} onOpenChange={setOpen} title="Withdraw this dispute?">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Withdrawing closes the dispute. The contract goes back to{" "}
            {previous ? (
              <strong className="text-text-primary">
                {previous.toLowerCase()}
              </strong>
            ) : (
              "its previous status"
            )}{" "}
            and the work can continue.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleWithdraw} isLoading={withdraw.isPending}>
              Withdraw dispute
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep dispute open
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
