"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Avatar } from "@/components/shared/avatar";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { InvitationStatusBadge } from "@/features/invitations/components/invitation-status-badge";
import { formatInvitationBudget } from "@/features/invitations/utils";
import { timeAgo } from "@/features/jobs/utils";
import { MessageButton } from "@/features/messaging/components/message-button";
import {
  useCancelInvitation,
  useSentInvitations,
} from "@/hooks/use-invitations";
import { useMyJobs } from "@/hooks/use-jobs";
import { invitationStatusLabels, type InvitationStatus } from "@/types/enums";

const PAGE_SIZE = 10;
const ALL = "ALL";

export function ClientInvitations() {
  const [jobFilter, setJobFilter] = useState<string>(ALL);
  const [status, setStatus] = useState<InvitationStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data: jobsData } = useMyJobs({ limit: 50 });
  const jobs = (jobsData?.jobs ?? []).filter((job) => job.status !== "DRAFT");

  const { data, isLoading } = useSentInvitations({
    jobId: jobFilter,
    status,
    page,
    limit: PAGE_SIZE,
  });
  const cancel = useCancelInvitation();

  const invitations = data?.invitations ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  async function handleCancel(invitationId: string) {
    try {
      await cancel.mutateAsync(invitationId);
      toast.success("Invitation cancelled.");
    } catch {
      // toasted globally
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Invitations</h1>
          <p className="text-text-secondary mt-1">
            Freelancers you&apos;ve invited to your jobs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {jobs.length > 0 && (
            <Select
              value={jobFilter}
              onChange={(e) => {
                setJobFilter(e.target.value);
                setPage(1);
              }}
              className="w-56"
              aria-label="Filter invitations by job"
            >
              <option value={ALL}>All my jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </Select>
          )}
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as InvitationStatus | "ALL");
              setPage(1);
            }}
            className="w-44"
            aria-label="Filter invitations by status"
          >
            <option value="ALL">All statuses</option>
            {Object.entries(invitationStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : invitations.length === 0 ? (
        <EmptyState
          icon={<Send className="h-6 w-6" />}
          title={
            status === ALL && jobFilter === ALL
              ? "No invitations sent yet"
              : "No invitations found"
          }
          description="Find a freelancer you like and invite them to one of your open jobs."
          actionLabel="Find talent"
          actionHref="/freelancers"
        />
      ) : (
        <>
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const freelancer = invitation.freelancer;
              const freelancerName = freelancer?.name || "Freelancer";
              const isCancelling =
                cancel.isPending && cancel.variables === invitation.id;

              return (
                <Card key={invitation.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={freelancerName}
                        imageUrl={freelancer?.imageUrl}
                        accent="freelancer"
                      />
                      <div className="min-w-0">
                        {freelancer?.id ? (
                          <Link
                            href={`/freelancers/${freelancer.id}`}
                            className="text-text-primary truncate text-sm font-semibold hover:underline"
                          >
                            {freelancerName}
                          </Link>
                        ) : (
                          <p className="text-text-primary truncate text-sm font-semibold">
                            {freelancerName}
                          </p>
                        )}
                        {freelancer?.title && (
                          <p className="text-text-secondary truncate text-xs">
                            {freelancer.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <InvitationStatusBadge status={invitation.status} />
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/jobs/${invitation.jobId}`}
                      className="text-text-primary hover:text-brand-600 text-base font-semibold"
                    >
                      {invitation.job.title}
                    </Link>
                    <p className="text-text-secondary mt-1 text-xs">
                      {formatInvitationBudget(invitation.job)} · Sent{" "}
                      {timeAgo(invitation.createdAt)}
                      {invitation.respondedAt &&
                        ` · Responded ${timeAgo(invitation.respondedAt)}`}
                    </p>
                  </div>

                  {invitation.message && (
                    <blockquote className="border-border text-text-secondary mt-3 border-l-2 pl-3 text-sm">
                      {invitation.message}
                    </blockquote>
                  )}

                  {invitation.status === "PENDING" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCancel(invitation.id)}
                        isLoading={isCancelling}
                        disabled={cancel.isPending}
                      >
                        Cancel invitation
                      </Button>
                      {freelancer?.id && (
                        <MessageButton
                          jobId={invitation.jobId}
                          otherUserId={freelancer.id}
                          size="sm"
                        />
                      )}
                    </div>
                  )}

                  {invitation.status === "ACCEPTED" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/client/applications?jobId=${invitation.jobId}`}
                      >
                        <Button size="sm" variant="secondary">
                          View applicants
                        </Button>
                      </Link>
                      {freelancer?.id && (
                        <MessageButton
                          jobId={invitation.jobId}
                          otherUserId={freelancer.id}
                          size="sm"
                        />
                      )}
                    </div>
                  )}

                  {invitation.status === "EXPIRED" && (
                    <p className="text-text-secondary mt-4 text-sm">
                      This job is no longer open, so the invitation expired.
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
