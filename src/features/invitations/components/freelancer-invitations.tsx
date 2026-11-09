"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
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
  useMyInvitations,
  useRespondToInvitation,
} from "@/hooks/use-invitations";
import { invitationStatusLabels, type InvitationStatus } from "@/types/enums";
import type { Invitation } from "@/types/invitation";

const PAGE_SIZE = 10;

export function FreelancerInvitations() {
  const router = useRouter();
  const [status, setStatus] = useState<InvitationStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMyInvitations({
    status,
    page,
    limit: PAGE_SIZE,
  });
  const respond = useRespondToInvitation();

  const invitations = data?.invitations ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  async function handleRespond(
    invitation: Invitation,
    next: "ACCEPTED" | "DECLINED",
  ) {
    try {
      const result = await respond.mutateAsync({
        invitationId: invitation.id,
        status: next,
      });
      if (next === "ACCEPTED") {
        toast.success("Invitation accepted. Send your proposal to complete it.");
        // Accepting doesn't create an application, so open the apply form.
        router.push(`/jobs/${result.jobId || invitation.jobId}?apply=1`);
      } else {
        toast.success("Invitation declined.");
      }
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
            Clients who invited you to apply for their jobs.
          </p>
        </div>
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

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : invitations.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-6 w-6" />}
          title={
            status === "ALL" ? "No invitations yet" : "No invitations found"
          }
          description={
            status === "ALL"
              ? "When a client invites you to a job, it will show up here."
              : "Invitations with this status will appear here."
          }
          actionLabel="Browse jobs"
          actionHref="/freelancer/jobs"
        />
      ) : (
        <>
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const client = invitation.client;
              const clientName =
                client?.companyName || client?.name || "A client";
              const isBusy =
                respond.isPending &&
                respond.variables?.invitationId === invitation.id;

              return (
                <Card key={invitation.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={clientName}
                        imageUrl={client?.imageUrl}
                        accent="client"
                      />
                      <div className="min-w-0">
                        {client?.id ? (
                          <Link
                            href={`/clients/${client.id}`}
                            className="text-text-primary truncate text-sm font-semibold hover:underline"
                          >
                            {clientName}
                          </Link>
                        ) : (
                          <p className="text-text-primary truncate text-sm font-semibold">
                            {clientName}
                          </p>
                        )}
                        <p className="text-text-secondary text-xs">
                          Invited you · {timeAgo(invitation.createdAt)}
                        </p>
                      </div>
                    </div>
                    <InvitationStatusBadge status={invitation.status} />
                  </div>

                  <Link href={`/jobs/${invitation.jobId}`} className="mt-4 block">
                    <h3 className="text-text-primary hover:text-brand-600 text-base font-semibold">
                      {invitation.job.title}
                    </h3>
                  </Link>
                  <p className="text-text-secondary mt-1 text-xs">
                    {formatInvitationBudget(invitation.job)}
                  </p>

                  {invitation.message && (
                    <blockquote className="border-border text-text-secondary mt-3 border-l-2 pl-3 text-sm">
                      {invitation.message}
                    </blockquote>
                  )}

                  {invitation.status === "PENDING" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRespond(invitation, "ACCEPTED")}
                        isLoading={
                          isBusy && respond.variables?.status === "ACCEPTED"
                        }
                        disabled={respond.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRespond(invitation, "DECLINED")}
                        isLoading={
                          isBusy && respond.variables?.status === "DECLINED"
                        }
                        disabled={respond.isPending}
                      >
                        Decline
                      </Button>
                      {client?.id && (
                        <MessageButton
                          jobId={invitation.jobId}
                          otherUserId={client.id}
                          size="sm"
                        />
                      )}
                    </div>
                  )}

                  {invitation.status === "ACCEPTED" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/jobs/${invitation.jobId}`}>
                        <Button size="sm" variant="secondary">
                          View job
                        </Button>
                      </Link>
                      {client?.id && (
                        <MessageButton
                          jobId={invitation.jobId}
                          otherUserId={client.id}
                          size="sm"
                        />
                      )}
                    </div>
                  )}

                  {invitation.status === "EXPIRED" && (
                    <p className="text-text-secondary mt-4 text-sm">
                      This job is no longer open.
                    </p>
                  )}

                  {invitation.status === "CANCELLED" && (
                    <p className="text-text-secondary mt-4 text-sm">
                      The client cancelled this invitation.
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