"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CancelContractDialog } from "@/features/contracts/components/cancel-contract-dialog";
import { ContractTimeline } from "@/features/contracts/components/contract-timeline";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { MessageButton } from "@/features/messaging/components/message-button";
import { ContractReviewSection } from "@/features/reviews/components/contract-review-section";
import { useContract } from "@/hooks/use-contracts";
import { ContractNotice } from "@/features/payments/components/contract-notice";
import { ContractSummaryCard } from "@/features/payments/components/contract-summary-card";
import { SubmitWorkCard } from "@/features/payments/components/submit-work-card";
import { SubmittedWorkCard } from "@/features/payments/components/submitted-work-card";

export default function FreelancerContractDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: contract, isLoading } = useContract(params.id);
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!contract) notFound();

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
              <Link
                href={`/jobs/${contract.jobId}`}
                className="text-brand-600 text-xs font-medium"
              >
                View job
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

      <ContractNotice contract={contract} role="FREELANCER" />

      <ContractSummaryCard contract={contract} />

      {contract.status === "ACTIVE" && (
        <SubmitWorkCard contractId={contract.id} />
      )}

      {(contract.status === "SUBMITTED" || contract.status === "COMPLETED") && (
        <SubmittedWorkCard contract={contract} title="Your submission" />
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
