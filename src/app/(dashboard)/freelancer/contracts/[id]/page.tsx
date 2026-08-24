"use client";

import { useParams, notFound } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { ContractTimeline } from "@/features/contracts/components/contract-timeline";

import { ReviewForm } from "@/features/reviews/components/review-form";
import { mockContracts } from "@/lib/mock-data/contracts";
import type { ContractStatus } from "@/types/contract";

export default function FreelancerContractDetailsPage() {
  const params = useParams<{ id: string }>();
  const contract = mockContracts.find((c) => c.id === params.id);
  const [status, setStatus] = useState<ContractStatus | null>(null);
  const [submissionNote, setSubmissionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!contract) notFound();
  const currentStatus = status ?? contract.status;

  async function handleSubmitWork() {
    if (!submissionNote.trim()) return;
    setIsSubmitting(true);
    // Track B: replace with real API call -> services/contracts.ts:submitWork(contract!.id, submissionNote)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("SUBMITTED");
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1>{contract.jobTitle}</h1>
          <p className="mt-1 text-text-secondary">{contract.clientName}</p>
        </div>
        <ContractStatusBadge status={currentStatus} />
      </div>

      <Card>
        <ContractTimeline status={currentStatus} />
      </Card>

      <Card>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-text-secondary">Budget</p>
            <p className="font-semibold text-text-primary">
              ${contract.budget}{contract.budgetType === "HOURLY" ? "/hr" : " fixed"}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Started</p>
            <p className="font-semibold text-text-primary">{contract.startedAt}</p>
          </div>
        </div>
      </Card>

      {/* Status-based actions: a freelancer only ever sees Submit Work while ACTIVE */}
      {currentStatus === "ACTIVE" && (
        <Card>
          <h3>Submit completed work</h3>
          <Textarea
            className="mt-3"
            rows={4}
            placeholder="Describe what you've completed, include links if relevant..."
            value={submissionNote}
            onChange={(e) => setSubmissionNote(e.target.value)}
          />
          <Button className="mt-3" onClick={handleSubmitWork} isLoading={isSubmitting}>
            Submit Work
          </Button>
        </Card>
      )}

      {currentStatus === "SUBMITTED" && (
        <Alert variant="info">
          Your work has been submitted and is awaiting client approval.
        </Alert>
      )}

      {currentStatus === "COMPLETED" && !reviewSubmitted && (
        <Card>
          <h3>Leave a review for {contract.clientName}</h3>
          <ReviewForm
            targetName={contract.clientName}
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