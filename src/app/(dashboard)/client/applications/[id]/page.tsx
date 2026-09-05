"use client";

import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { getInitials } from "@/lib/get-initials";
import {
  useApplication,
  useUpdateApplicationStatus,
} from "@/hooks/use-applications";

export default function ApplicantDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: application, isLoading, isError } = useApplication(params.id);
  const updateStatus = useUpdateApplicationStatus();
  const [hireNotice, setHireNotice] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (isError || !application) notFound();

  async function handleShortlist() {
    try {
      await updateStatus.mutateAsync({
        applicationId: application!.id,
        status: "SHORTLISTED",
      });
      toast.success("Applicant shortlisted.");
    } catch {
      // toasted globally
    }
  }

  async function handleReject() {
    try {
      await updateStatus.mutateAsync({
        applicationId: application!.id,
        status: "REJECTED",
      });
      toast.success("Applicant rejected.");
    } catch {
      // toasted globally
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-brand-100 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold">
            {getInitials(application.freelancerName)}
          </span>
          <div>
            <h1>{application.freelancerName}</h1>
            {application.freelancerTitle && (
              <p className="text-text-secondary">
                {application.freelancerTitle}
              </p>
            )}
          </div>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      {application.status === "HIRED" && (
        <Alert variant="success">
          You&apos;ve hired this applicant. Check your contracts to proceed.
        </Alert>
      )}
      {application.status === "REJECTED" && (
        <Alert variant="error">You&apos;ve rejected this applicant.</Alert>
      )}

      <Card>
        <h3>Applied for</h3>
        <p className="text-text-primary mt-2 text-sm font-medium">
          {application.jobTitle}
        </p>

        <h3 className="mt-6">Cover letter</h3>
        <p className="text-text-secondary mt-2 text-sm">
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
              {application.estimatedDeliveryDays} days
            </p>
          </div>
        </div>
      </Card>

      {(application.status === "PENDING" ||
        application.status === "SHORTLISTED") && (
        <div className="flex flex-wrap gap-2">
          {application.status === "PENDING" && (
            <Button
              variant="secondary"
              onClick={handleShortlist}
              isLoading={updateStatus.isPending}
            >
              Shortlist
            </Button>
          )}
          <Button onClick={() => setHireNotice(true)}>Hire Freelancer</Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            isLoading={updateStatus.isPending}
          >
            Reject
          </Button>
        </div>
      )}

      {hireNotice && (
        <Alert variant="info">
          Hiring creates a contract and is handled from the Contracts section —
          this is coming in the next build phase.
        </Alert>
      )}
    </div>
  );
}
