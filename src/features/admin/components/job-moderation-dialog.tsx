"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSetJobStatusAsAdmin } from "@/hooks/use-admin";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { AdminJob, AdminJobAction } from "@/types/admin";

const NOTE_MAX = 500;

const options: { value: AdminJobAction; title: string; description: string }[] =
  [
    {
      value: "CANCELLED",
      title: "Cancel the job",
      description:
        "Takes the job down. Use this for jobs that break the rules or shouldn't be on Nexora.",
    },
    {
      value: "CLOSED",
      title: "Close the job",
      description:
        "Stops new applications and ends the listing. Use this when the job simply shouldn't stay open.",
    },
  ];

interface JobModerationDialogProps {
  job: AdminJob | null;
  onClose: () => void;
}

export function JobModerationDialog({
  job,
  onClose,
}: JobModerationDialogProps) {
  return (
    <Dialog
      open={!!job}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Moderate job"
    >
      {/* The Dialog only renders its children while open, so the form starts
          fresh every time. */}
      {job && <ModerationForm job={job} onDone={onClose} />}
    </Dialog>
  );
}

function ModerationForm({
  job,
  onDone,
}: {
  job: AdminJob;
  onDone: () => void;
}) {
  const setStatus = useSetJobStatusAsAdmin();
  const [action, setAction] = useState<AdminJobAction>("CANCELLED");
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNoteError(null);
    setServerMessage(null);

    try {
      await setStatus.mutateAsync({
        jobId: job.id,
        status: action,
        note: note.trim() || undefined,
      });
      toast.success(action === "CANCELLED" ? "Job cancelled." : "Job closed.");
      onDone();
    } catch (error) {
      if (!(error instanceof ApiError)) return;
      if (error.errors) setNoteError(error.errors.note?.[0] ?? null);
      // A 400 or 409 with no field errors means the job can't be moderated
      // right now (for example its status just changed).
      if ((error.status === 400 || error.status === 409) && !error.errors) {
        setServerMessage(error.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverMessage && <Alert variant="warning">{serverMessage}</Alert>}

      <div>
        <p className="text-text-primary text-sm font-medium">{job.title}</p>
        <p className="text-text-secondary text-xs">
          Posted by {job.client.companyName || job.client.name}
        </p>
      </div>

      <fieldset>
        <legend className="text-text-primary mb-2 text-sm font-medium">
          What should happen?
        </legend>
        <div className="space-y-2">
          {options.map((option) => {
            const selected = option.value === action;
            return (
              <label
                key={option.value}
                className={cn(
                  "border-border flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                  selected
                    ? "border-brand-600 bg-brand-500/5"
                    : "hover:bg-surface-muted",
                )}
              >
                <input
                  type="radio"
                  name="job-action"
                  value={option.value}
                  checked={selected}
                  onChange={() => setAction(option.value)}
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
      </fieldset>

      <div>
        <Label htmlFor="job-moderation-note">Note (optional)</Label>
        <Textarea
          id="job-moderation-note"
          rows={3}
          maxLength={NOTE_MAX}
          placeholder="Why are you doing this? It's recorded with the action."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="mt-1 flex items-start justify-between gap-3">
          {noteError ? (
            <p className="text-status-error text-xs">{noteError}</p>
          ) : (
            <span />
          )}
          <span className="text-text-secondary shrink-0 text-xs">
            {note.length}/{NOTE_MAX}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          variant="destructive"
          isLoading={setStatus.isPending}
        >
          {action === "CANCELLED" ? "Cancel job" : "Close job"}
        </Button>
        <Button type="button" variant="secondary" onClick={onDone}>
          Keep it open
        </Button>
      </div>
    </form>
  );
}
