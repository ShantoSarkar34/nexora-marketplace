"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { ContractTimeline } from "@/features/contracts/components/contract-timeline";
import { CancelContractDialog } from "@/features/contracts/components/cancel-contract-dialog";
import {
  useApproveWork,
  useContract,
  useRequestRevision,
} from "@/hooks/use-contracts";
import { PayNowButton } from "@/features/payments/components/pay-now-button";
import { ContractReviewSection } from "@/features/reviews/components/contract-review-section";

export default function ClientContractDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: contract, isLoading, isError } = useContract(params.id);
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
  if (isError || !contract) notFound();

  async function handleApprove() {
    try {
      await approveWork.mutateAsync(contract!.id);
      toast.success("Work approved — contract completed!");
    } catch {
      // toasted globally
    }
  }

  async function handleRequestRevision() {
    try {
      await requestRevision.mutateAsync(contract!.id);
      toast.success("Revision requested — contract set back to active.");
    } catch {
      // toasted globally
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1>{contract.jobTitle}</h1>
          <p className="text-text-secondary mt-1">{contract.freelancerName}</p>
        </div>
        <ContractStatusBadge status={contract.status} />
      </div>

      <Card>
        <ContractTimeline status={contract.status} />
      </Card>

      {contract.status === "PENDING" && (
        <Alert variant="info">
          This contract is pending payment. Complete payment to activate it and
          let {contract.freelancerName} begin work.{" "}
          <Link
            href={`/client/payments?contractId=${contract.id}`}
            className="font-medium underline"
          >
            Go to Payments
          </Link>
        </Alert>
      )}

      {contract.status === "SUBMITTED" && (
        <Card>
          <h3>Submitted work</h3>
          {contract.submissionNote && (
            <p className="text-text-secondary mt-2 text-sm">
              {contract.submissionNote}
            </p>
          )}
          {contract.submissionUrl && (
            <a
              href={contract.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 mt-2 block text-sm font-medium"
            >
              View submitted work →
            </a>
          )}
          <div className="mt-4 flex gap-2">
            <Button onClick={handleApprove} isLoading={approveWork.isPending}>
              Approve Work
            </Button>
            <Button
              variant="secondary"
              onClick={handleRequestRevision}
              isLoading={requestRevision.isPending}
            >
              Request Revision
            </Button>
          </div>
        </Card>
      )}

      {contract.status === "COMPLETED" && (
        <ContractReviewSection
          contractId={contract.id}
          targetName={contract.freelancerName}
        />
      )}

      {contract.status === "PENDING" && (
        <Alert variant="info">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              This contract is pending payment. Complete payment to activate it
              and let {contract.freelancerName} begin work.
            </span>
            <PayNowButton contractId={contract.id} />
          </div>
        </Alert>
      )}

      <CancelContractDialog
        contractId={contract.id}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </div>
  );
}
