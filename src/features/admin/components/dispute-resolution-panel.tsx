"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResolveDispute } from "@/hooks/use-admin";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { contractStatusLabels, type DisputeResolution } from "@/types/enums";
import type { Dispute } from "@/types/dispute";

const NOTE_MIN = 10;
const NOTE_MAX = 2000;
// The server reports a failed Stripe refund in its message.
const REFUND_FAILED_PATTERN = /refund[^.]*fail|fail[^.]*refund/i;

interface ResolutionOption {
  value: DisputeResolution;
  title: string;
  description: string;
  confirm: string;
}

function buildOptions(dispute: Dispute): ResolutionOption[] {
  const { client, freelancer } = dispute.contract;
  const previous = dispute.previousContractStatus
    ? contractStatusLabels[dispute.previousContractStatus].toLowerCase()
    : "its previous status";

  return [
    {
      value: "REFUND_CLIENT",
      title: "Refund the client",
      description:
        "Cancels the contract and refunds the client's payment through Stripe. The freelancer isn't paid.",
      confirm: `Cancel the contract and refund ${client.name}? ${freelancer.name} won't be paid.`,
    },
    {
      value: "RELEASE_TO_FREELANCER",
      title: "Release to the freelancer",
      description:
        "Completes the contract and the job. The payment counts as the freelancer's earnings.",
      confirm: `Complete the contract and release the payment to ${freelancer.name}?`,
    },
    {
      value: "NO_ACTION",
      title: "No action",
      description: `Closes the dispute and returns the contract to ${previous}. No money moves.`,
      confirm: `Close the dispute with no action? The contract goes back to ${previous}.`,
    },
  ];
}

export function DisputeResolutionPanel({ dispute }: { dispute: Dispute }) {
  const resolve = useResolveDispute();
  const options = buildOptions(dispute);

  const [resolution, setResolution] = useState<DisputeResolution | null>(null);
  const [note, setNote] = useState("");
  const [resolutionError, setResolutionError] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selected =
    options.find((option) => option.value === resolution) ?? null;

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    setServerMessage(null);

    let valid = true;
    if (!resolution) {
      setResolutionError("Choose an outcome.");
      valid = false;
    } else {
      setResolutionError(null);
    }
    if (note.trim().length < NOTE_MIN) {
      setNoteError(
        `Write at least ${NOTE_MIN} characters explaining your decision.`,
      );
      valid = false;
    } else {
      setNoteError(null);
    }

    if (valid) setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!resolution) return;

    try {
      const result = await resolve.mutateAsync({
        disputeId: dispute.id,
        resolution,
        note: note.trim(),
      });
      setConfirmOpen(false);

      if (
        result.refundStatus === "FAILED" ||
        REFUND_FAILED_PATTERN.test(result.message)
      ) {
        toast.warning(
          result.message ||
            "The dispute was resolved, but the refund needs manual follow-up.",
          { duration: 12_000 },
        );
      } else {
        toast.success("Dispute resolved.");
      }
    } catch (error) {
      setConfirmOpen(false);
      if (!(error instanceof ApiError)) return;

      if (error.errors) {
        setNoteError(error.errors.note?.[0] ?? null);
        setResolutionError(error.errors.resolution?.[0] ?? null);
      }
      // A 400 or 409 with no field errors means the dispute is no longer
      // open (for example the person who opened it just withdrew it).
      if ((error.status === 400 || error.status === 409) && !error.errors) {
        setServerMessage(error.message);
      }
    }
  }

  return (
    <Card>
      <h3>Resolve this dispute</h3>
      <p className="text-text-secondary mt-1 text-sm">
        Both people are notified of the outcome. Resolving can&apos;t be undone.
      </p>

      <form onSubmit={handleReview} className="mt-4 space-y-5">
        {serverMessage && <Alert variant="warning">{serverMessage}</Alert>}

        <fieldset>
          <legend className="text-text-primary mb-2 text-sm font-medium">
            Outcome
          </legend>
          <div className="space-y-2">
            {options.map((option) => {
              const isSelected = option.value === resolution;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "border-border flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                    isSelected
                      ? "border-brand-600 bg-brand-500/5"
                      : "hover:bg-surface-muted",
                  )}
                >
                  <input
                    type="radio"
                    name="resolution"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => {
                      setResolution(option.value);
                      setResolutionError(null);
                    }}
                    className="accent-brand-600 mt-1"
                  />
                  <span>
                    <span className="text-text-primary block text-sm font-medium">
                      {option.title}
                    </span>
                    <span className="text-text-secondary mt-0.5 block text-xs">
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {resolutionError && (
            <p className="text-status-error mt-2 text-xs">{resolutionError}</p>
          )}
        </fieldset>

        <div>
          <Label htmlFor="resolution-note">Your decision</Label>
          <Textarea
            id="resolution-note"
            rows={5}
            maxLength={NOTE_MAX}
            placeholder="Explain what you decided and why. Both people will see this."
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteError(null);
            }}
          />
          <div className="mt-1 flex items-start justify-between gap-3">
            {noteError ? (
              <p className="text-status-error text-xs">{noteError}</p>
            ) : (
              <span className="text-text-secondary text-xs">
                At least {NOTE_MIN} characters.
              </span>
            )}
            <span className="text-text-secondary shrink-0 text-xs">
              {note.length}/{NOTE_MAX}
            </span>
          </div>
        </div>

        <Button type="submit">Review and resolve</Button>
      </form>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm resolution"
      >
        <div className="space-y-4">
          <p className="text-text-primary text-sm">{selected?.confirm}</p>
          <p className="text-text-secondary text-sm">
            This can&apos;t be undone.
          </p>
          <div className="flex gap-2">
            <Button
              variant={
                resolution === "REFUND_CLIENT" ? "destructive" : "primary"
              }
              onClick={handleConfirm}
              isLoading={resolve.isPending}
            >
              Confirm
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={resolve.isPending}
            >
              Go back
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}
