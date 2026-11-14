"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { safeHttpUrl } from "@/features/contracts/utils";
import { useSubmitWork } from "@/hooks/use-contracts";
import { ApiError } from "@/lib/api-client";

export function SubmitWorkCard({ contractId }: { contractId: string }) {
  const submitWork = useSubmitWork();
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmedNote = note.trim();
    const trimmedUrl = url.trim();

    setNoteError(null);
    setUrlError(null);

    if (!trimmedNote && !trimmedUrl) {
      toast.error("Add a note or a link before submitting.");
      return;
    }
    if (trimmedUrl && !safeHttpUrl(trimmedUrl)) {
      setUrlError("Enter a full link starting with http:// or https://");
      return;
    }

    try {
      await submitWork.mutateAsync({
        contractId,
        submissionNote: trimmedNote || undefined,
        submissionUrl: trimmedUrl || undefined,
      });
      toast.success("Work submitted for review.");
      setNote("");
      setUrl("");
    } catch (error) {
      // Anything else is toasted globally.
      if (error instanceof ApiError && error.errors) {
        setNoteError(error.errors.submissionNote?.[0] ?? null);
        setUrlError(error.errors.submissionUrl?.[0] ?? null);
      }
    }
  }

  return (
    <Card>
      <h3>Submit completed work</h3>
      <div className="mt-3 space-y-3">
        <div>
          <Label htmlFor="submission-note">Note</Label>
          <Textarea
            id="submission-note"
            rows={4}
            placeholder="Describe what you've completed..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {noteError && (
            <p className="text-status-error mt-1 text-xs">{noteError}</p>
          )}
        </div>
        <div>
          <Label htmlFor="submission-url">Link (optional)</Label>
          <Input
            id="submission-url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {urlError && (
            <p className="text-status-error mt-1 text-xs">{urlError}</p>
          )}
        </div>
      </div>
      <Button
        className="mt-4"
        onClick={handleSubmit}
        isLoading={submitWork.isPending}
      >
        Submit Work
      </Button>
    </Card>
  );
}
