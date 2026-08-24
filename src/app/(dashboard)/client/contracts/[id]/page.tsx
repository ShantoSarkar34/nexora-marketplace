"use client";

import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { ContractTimeline } from "@/features/contracts/components/contract-timeline";
import { ReviewForm } from "@/features/reviews/components/review-form";
import { mockContracts } from "@/lib/mock-data/contracts";
import type { ContractStatus } from "@/types/contract";

export default function ClientContractDetailsPage() {
  const params = useParams<{ id: string }>();
  const contract = mockContracts.find((c) => c.id === params.id);
  const [status, setStatus] = useState<ContractStatus | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!contract) notFound();
  const currentStatus = status ?? contract.status;

  function approveWork() {
    // Track B: replace with real API call -> services/contracts.ts:approveWork(contract!.id)
    setStatus("COMPLETED");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1>{contract.jobTitle}</h1>
          <p className="mt-1 text-text-secondary">{contract.freelancerName}</p>
        </div>
        <ContractStatusBadge status={currentStatus} />
      </div>

      <Card>
        <ContractTimeline status={currentStatus} />
      </Card>

      {currentStatus === "PENDING" && (
        <Alert variant="info">
          This contract is pending payment. Complete payment to activate it.{" "}
          <Link href="/client/payments" className="font-medium underline">
            Go to Payments
          </Link>
        </Alert>
      )}

      {/* Status-based action: a client only sees Approve Work once SUBMITTED */}
      {currentStatus === "SUBMITTED" && (
        <Card>
          <h3>Submitted work</h3>
          <p className="mt-2 text-sm text-text-secondary">
            {contract.workSubmissionNote}
          </p>
          <Button className="mt-4" onClick={approveWork}>
            Approve Work
          </Button>
        </Card>
      )}

      {currentStatus === "COMPLETED" && !reviewSubmitted && (
        <Card>
          <h3>Leave a review for {contract.freelancerName}</h3>
          <ReviewForm
            targetName={contract.freelancerName}
            onSubmit={() => setReviewSubmitted(true)}
          />
        </Card>
      )}

      {currentStatus === "COMPLETED" && reviewSubmitted && (
        <Alert variant="success">Thanks — your review has been submitted.</Alert>
      )}
    </div>
  );
}