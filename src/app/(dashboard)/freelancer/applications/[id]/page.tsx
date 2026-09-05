"use client";

import { useParams, notFound } from "next/navigation";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import {
  useApplication,
  useWithdrawApplication,
} from "@/hooks/use-applications";

export default function ApplicationDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: application, isLoading, isError } = useApplication(params.id);
  const withdraw = useWithdrawApplication();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (isError || !application) notFound();

  const canWithdraw =
    application.status === "PENDING" || application.status === "SHORTLISTED";

  async function handleWithdraw() {
    try {
      await withdraw.mutateAsync(application!.id);
      toast.success("Application withdrawn.");
    } catch {
      // toasted globally
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1>{application.jobTitle}</h1>
          <p className="text-text-secondary mt-1">{application.clientName}</p>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      {application.status === "WITHDRAWN" && (
        <Alert variant="info">You&apos;ve withdrawn this application.</Alert>
      )}
      {application.status === "HIRED" && (
        <Alert variant="success">
          You were hired for this job! Check your contracts.
        </Alert>
      )}
      {application.status === "REJECTED" && (
        <Alert variant="error">This application was not selected.</Alert>
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
              {application.estimatedDeliveryDays} days
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Applied on</p>
            <p className="text-text-primary font-semibold">
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {canWithdraw && (
        <Button
          variant="destructive"
          onClick={handleWithdraw}
          isLoading={withdraw.isPending}
        >
          Withdraw Application
        </Button>
      )}
    </div>
  );
}
