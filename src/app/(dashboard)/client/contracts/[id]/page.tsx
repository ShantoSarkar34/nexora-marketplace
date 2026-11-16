"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Avatar } from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CancelContractDialog } from "@/features/contracts/components/cancel-contract-dialog";
import { ContractTimeline } from "@/features/contracts/components/contract-timeline";
import { SubmittedWorkCard } from "@/features/contracts/components/submitted-work-card";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { ContractDisputeSection } from "@/features/disputes/components/contract-dispute-section";
import { OpenDisputeButton } from "@/features/disputes/components/open-dispute-button";
import { canOpenDispute } from "@/features/disputes/utils";
import { MessageButton } from "@/features/messaging/components/message-button";
import { ContractReviewSection } from "@/features/reviews/components/contract-review-section";
import {
  useApproveWork,
  useContract,
  useRequestRevision,
} from "@/hooks/use-contracts";
import { ContractNotice } from "@/features/payments/components/contract-notice";
import { ContractSummaryCard } from "@/features/payments/components/contract-summary-card";

export default function ClientContractDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: contract, isLoading } = useContract(params.id);
  const approveWork = useApproveWork();
  const requestRevision = useRequestRevision();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  // Only a contract that never loaded is a 404. A failed background refresh
  // keeps showing the data we already have.
  if (!contract) notFound();

  const contractId = contract.id;
  const actionPending = approveWork.isPending || requestRevision.isPending;
  const canCancel =
    contract.status === "PENDING" || contract.status === "ACTIVE";
  // Work that was submitted stays visible while it's disputed: it is the
  // evidence both sides need.
  const showWork =
    contract.status === "SUBMITTED" ||
    contract.status === "COMPLETED" ||
    contract.status === "DISPUTED";

  async function handleApprove() {
    try {
      await approveWork.mutateAsync(contractId);
      toast.success("Work approved — contract completed!");
    } catch {
      // toasted globally
    }
  }

  async function handleRequestRevision() {
    try {
      await requestRevision.mutateAsync(contractId);
      toast.success("Revision requested — contract set back to active.");
    } catch {
      // toasted globally
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            name={contract.freelancerName}
            imageUrl={contract.freelancerImageUrl}
            size="lg"
            accent="freelancer"
          />
          <div className="min-w-0">
            <h1>{contract.jobTitle}</h1>
            <p className="text-text-secondary mt-1">
              {contract.freelancerName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/freelancers/${contract.freelancerId}`}
                target="_blank"
                className="text-brand-600 flex items-center gap-1 text-xs font-medium"
              >
                View freelancer profile <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href={`/jobs/${contract.jobId}`}
                className="text-brand-600 text-xs font-medium"
              >
                View job
              </Link>
              <MessageButton
                jobId={contract.jobId}
                otherUserId={contract.freelancerId}
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

      <ContractNotice contract={contract} role="CLIENT" />

      <ContractDisputeSection contract={contract} role="CLIENT" />

      <ContractSummaryCard contract={contract} />

      {showWork && (
        <SubmittedWorkCard
          contract={contract}
          title={
            contract.status === "COMPLETED"
              ? "Delivered work"
              : "Submitted work"
          }
          actions={
            contract.status === "SUBMITTED" ? (
              <>
                <Button
                  onClick={handleApprove}
                  isLoading={approveWork.isPending}
                  disabled={actionPending}
                >
                  Approve Work
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleRequestRevision}
                  isLoading={requestRevision.isPending}
                  disabled={actionPending}
                >
                  Request Revision
                </Button>
              </>
            ) : undefined
          }
        />
      )}

      {contract.status === "COMPLETED" && (
        <ContractReviewSection
          contractId={contract.id}
          targetName={contract.freelancerName}
        />
      )}

      {(canCancel || canOpenDispute(contract.status)) && (
        <div className="flex flex-wrap gap-2">
          {canCancel && (
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              Cancel Contract
            </Button>
          )}
          <OpenDisputeButton
            contractId={contract.id}
            status={contract.status}
          />
        </div>
      )}

      <CancelContractDialog
        contractId={contract.id}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </div>
  );
}
