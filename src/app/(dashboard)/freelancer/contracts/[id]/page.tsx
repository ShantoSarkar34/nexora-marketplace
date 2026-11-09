"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Avatar } from "@/components/shared/avatar";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { CancelContractDialog } from "@/features/contracts/components/cancel-contract-dialog";
import { ContractTimeline } from "@/features/contracts/components/contract-timeline";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { MessageButton } from "@/features/messaging/components/message-button";
import { ContractReviewSection } from "@/features/reviews/components/contract-review-section";
import { useContract, useSubmitWork } from "@/hooks/use-contracts";

export default function FreelancerContractDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: contract, isLoading, isError } = useContract(params.id);
  const submitWork = useSubmitWork();
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (isError || !contract) notFound();

  async function handleSubmitWork() {
    if (!note.trim() && !url.trim()) {
      toast.error("Add a note or a link before submitting.");
      return;
    }
    try {
      await submitWork.mutateAsync({
        contractId: contract!.id,
        submissionNote: note.trim() || undefined,
        submissionUrl: url.trim() || undefined,
      });
      toast.success("Work submitted for review.");
    } catch {
      // toasted globally
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            name={contract.clientName}
            imageUrl={contract.clientImageUrl}
            size="lg"
            accent="client"
          />
          <div className="min-w-0">
            <h1>{contract.jobTitle}</h1>
            <p className="text-text-secondary mt-1">{contract.clientName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/clients/${contract.clientId}`}
                target="_blank"
                className="text-brand-600 flex items-center gap-1 text-xs font-medium"
              >
                View client profile <ExternalLink className="h-3 w-3" />
              </Link>
              <MessageButton
                jobId={contract.jobId}
                otherUserId={contract.clientId}
                size="sm"
              />
            </div>
          </div>
        </div>
        <ContractStatusBadge status={contract.status} />
      </div>

      <Card>
        <ContractTimeline status={contract.status} />
      </Card>

      {contract.status === "PENDING" && (
        <Alert variant="info">
          You&apos;ve been hired! This contract will activate automatically once
          the client completes payment.
        </Alert>
      )}

      <Card>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-text-secondary">Budget</p>
            <p className="text-text-primary font-semibold">
              ${contract.agreedBudget}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Started</p>
            <p className="text-text-primary font-semibold">
              {new Date(contract.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {contract.status === "ACTIVE" && (
        <Card>
          <h3>Submit completed work</h3>
          <div className="mt-3 space-y-3">
            <div>
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                rows={4}
                placeholder="Describe what you've completed..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="url">Link (optional)</Label>
              <Input
                id="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="mt-3"
            onClick={handleSubmitWork}
            isLoading={submitWork.isPending}
          >
            Submit Work
          </Button>
        </Card>
      )}

      {contract.status === "SUBMITTED" && (
        <Alert variant="info">
          Your work has been submitted and is awaiting client review.
        </Alert>
      )}

      {contract.status === "COMPLETED" && (
        <ContractReviewSection
          contractId={contract.id}
          targetName={contract.clientName}
        />
      )}

      {(contract.status === "PENDING" || contract.status === "ACTIVE") && (
        <Button variant="destructive" onClick={() => setCancelOpen(true)}>
          Cancel Contract
        </Button>
      )}

      <CancelContractDialog
        contractId={contract.id}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </div>
  );
}
