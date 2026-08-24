"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { mockApplications } from "@/lib/mock-data/applications";

export default function ApplicationDetailsPage() {
  const params = useParams<{ id: string }>();
  const application = mockApplications.find((a) => a.id === params.id);
  const [withdrawn, setWithdrawn] = useState(false);

  if (!application) notFound();

  const canWithdraw = application.status === "PENDING" && !withdrawn;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1>{application.jobTitle}</h1>
          <p className="text-text-secondary mt-1">{application.clientName}</p>
        </div>
        <ApplicationStatusBadge
          status={withdrawn ? "WITHDRAWN" : application.status}
        />
      </div>

      {withdrawn && (
        <Alert variant="info">You&apos;ve withdrawn this application.</Alert>
      )}

      <Card>
        <h3>Your proposal</h3>
        <p className="text-text-secondary mt-3 text-sm">
          {application.coverLetter}
        </p>
        <div className="border-border mt-4 flex gap-6 border-t pt-4 text-sm">
          <div>
            <p className="text-text-secondary">Proposed budget</p>
            <p className="text-text-primary font-semibold">
              ${application.proposedBudget}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Estimated delivery</p>
            <p className="text-text-primary font-semibold">
              {application.estimatedDays} days
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Applied on</p>
            <p className="text-text-primary font-semibold">
              {application.appliedAt}
            </p>
          </div>
        </div>
      </Card>

      {canWithdraw && (
        <Button
          variant="destructive"
          onClick={() => {
            // Track B: replace with real API call -> services/applications.ts:withdraw(application.id)
            setWithdrawn(true);
          }}
        >
          Withdraw Application
        </Button>
      )}
    </div>
  );
}
