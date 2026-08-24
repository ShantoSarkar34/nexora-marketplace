"use client";

import { useParams, notFound } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { mockJobApplicants } from "@/lib/mock-data/applications";
import type { ApplicationStatus } from "@/types/application";

export default function ApplicantDetailsPage() {
  const params = useParams<{ id: string }>();
  const applicant = mockJobApplicants.find((a) => a.id === params.id);
  const [status, setStatus] = useState<ApplicationStatus | null>(null);

  if (!applicant) notFound();

  const currentStatus = status ?? applicant.status;

  function updateStatus(next: ApplicationStatus) {
    // Track B: replace with real API call -> services/applications.ts:updateStatus(applicant.id, next)
    setStatus(next);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-brand-100 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
            {applicant.freelancerAvatarInitials}
          </span>
          <div>
            <h1>{applicant.freelancerName}</h1>
            <p className="text-text-secondary">{applicant.freelancerTitle}</p>
          </div>
        </div>
        <ApplicationStatusBadge status={currentStatus} />
      </div>

      {currentStatus === "HIRED" && (
        <Alert variant="success">
          You&apos;ve hired {applicant.freelancerName}. A contract has been
          created (mock).
        </Alert>
      )}
      {currentStatus === "REJECTED" && (
        <Alert variant="error">You&apos;ve rejected this applicant.</Alert>
      )}

      <Card>
        <h3>Applied for</h3>
        <p className="text-text-primary mt-2 text-sm font-medium">
          {applicant.jobTitle}
        </p>

        <h3 className="mt-6">Cover letter</h3>
        <p className="text-text-secondary mt-2 text-sm">
          {applicant.coverLetter}
        </p>

        <div className="border-border mt-4 flex gap-6 border-t pt-4 text-sm">
          <div>
            <p className="text-text-secondary">Proposed budget</p>
            <p className="text-text-primary font-semibold">
              ${applicant.proposedBudget}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Estimated delivery</p>
            <p className="text-text-primary font-semibold">
              {applicant.estimatedDays} days
            </p>
          </div>
        </div>
      </Card>

      {currentStatus === "PENDING" || currentStatus === "SHORTLISTED" ? (
        <div className="flex flex-wrap gap-2">
          {currentStatus === "PENDING" && (
            <Button
              variant="secondary"
              onClick={() => updateStatus("SHORTLISTED")}
            >
              Shortlist
            </Button>
          )}
          <Button onClick={() => updateStatus("HIRED")}>Hire Freelancer</Button>
          <Button
            variant="destructive"
            onClick={() => updateStatus("REJECTED")}
          >
            Reject
          </Button>
        </div>
      ) : null}
    </div>
  );
}
