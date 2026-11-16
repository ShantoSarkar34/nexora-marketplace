"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DISPUTE_REASON_MAX,
  DISPUTE_REASON_MIN,
  openDisputeSchema,
  type OpenDisputeFormValues,
} from "@/features/disputes/schemas";
import { useOpenDispute } from "@/hooks/use-disputes";
import { ApiError } from "@/lib/api-client";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";

interface OpenDisputeDialogProps {
  contractId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpenDisputeDialog({
  contractId,
  open,
  onOpenChange,
}: OpenDisputeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Open a dispute">
      {/* The Dialog only renders its children while open, so the form starts
          empty every time it is opened. */}
      <OpenDisputeForm
        contractId={contractId}
        onDone={() => onOpenChange(false)}
      />
    </Dialog>
  );
}

function OpenDisputeForm({
  contractId,
  onDone,
}: {
  contractId: string;
  onDone: () => void;
}) {
  const openDispute = useOpenDispute(contractId);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<OpenDisputeFormValues>({
    resolver: zodResolver(openDisputeSchema),
    defaultValues: { reason: "" },
  });

  const length = (watch("reason") ?? "").trim().length;
  const remaining = Math.max(0, DISPUTE_REASON_MIN - length);

  async function onSubmit(values: OpenDisputeFormValues) {
    setServerMessage(null);
    try {
      await openDispute.mutateAsync(values.reason);
      toast.success(
        "Dispute opened. The contract is paused while it's reviewed.",
      );
      onDone();
    } catch (error) {
      if (!(error instanceof ApiError)) return;
      if (error.errors) applyApiFieldErrors(setError, error.errors);
      // A 400 or 409 with no field errors means the contract can't be
      // disputed right now (for example it already is).
      if ((error.status === 400 || error.status === 409) && !error.errors) {
        setServerMessage(error.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverMessage && <Alert variant="warning">{serverMessage}</Alert>}

      <Alert variant="info">
        Opening a dispute pauses this contract. Submitting work, approving,
        requesting revisions and cancelling stay locked until an admin resolves
        it or you withdraw it. Try messaging the other person first if you
        haven&apos;t.
      </Alert>

      <div>
        <Label htmlFor="dispute-reason">What went wrong?</Label>
        <Textarea
          id="dispute-reason"
          rows={6}
          maxLength={DISPUTE_REASON_MAX}
          placeholder="Explain what was agreed, what happened, and what you'd like to see happen."
          {...register("reason")}
        />
        <div className="mt-1 flex items-start justify-between gap-3">
          {errors.reason ? (
            <p className="text-status-error text-xs">{errors.reason.message}</p>
          ) : remaining > 0 ? (
            <p className="text-text-secondary text-xs">
              At least {DISPUTE_REASON_MIN} characters ({remaining} more)
            </p>
          ) : (
            <span />
          )}
          <span className="text-text-secondary shrink-0 text-xs">
            {length}/{DISPUTE_REASON_MAX}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          variant="destructive"
          isLoading={openDispute.isPending}
        >
          Open dispute
        </Button>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
