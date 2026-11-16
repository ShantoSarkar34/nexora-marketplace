"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import {
  formatContractDate,
  type ContractRole,
} from "@/features/contracts/utils";
import { DisputeStatusBadge } from "@/features/disputes/components/dispute-status-badge";
import { WithdrawDisputeButton } from "@/features/disputes/components/withdraw-dispute-button";
import { disputesBasePath } from "@/features/disputes/utils";
import { MessageButton } from "@/features/messaging/components/message-button";
import { formatMoney } from "@/features/payments/utils";
import { useAuth } from "@/hooks/use-auth";
import { useDispute } from "@/hooks/use-disputes";
import { ApiError } from "@/lib/api-client";
import {
  contractStatusLabels,
  disputeResolutionLabels,
  refundStatusLabels,
} from "@/types/enums";
import type { DisputeParty } from "@/types/dispute";

function Party({
  label,
  party,
  href,
  accent,
}: {
  label: string;
  party: DisputeParty;
  href: string;
  accent: "client" | "freelancer";
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={party.name} imageUrl={party.imageUrl} accent={accent} />
      <div className="min-w-0">
        <p className="text-text-secondary text-xs">{label}</p>
        {party.id ? (
          <Link
            href={href}
            className="text-text-primary block truncate text-sm font-medium hover:underline"
          >
            {party.name}
          </Link>
        ) : (
          <p className="text-text-primary truncate text-sm font-medium">
            {party.name}
          </p>
        )}
      </div>
    </div>
  );
}

export function DisputeDetail({
  role,
  disputeId,
}: {
  role: ContractRole;
  disputeId: string;
}) {
  const { user } = useAuth();
  const { data: dispute, isLoading, error, refetch } = useDispute(disputeId);

  const listPath = disputesBasePath(role);
  const contractsPath =
    role === "CLIENT" ? "/client/contracts" : "/freelancer/contracts";

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!dispute) {
    // A dispute that doesn't exist, or that isn't yours, is a 404.
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.status === 403)
    ) {
      notFound();
    }
    return (
      <div className="border-border bg-surface mx-auto max-w-md rounded-md border px-6 py-12 text-center">
        <p className="text-text-primary font-medium">
          We couldn&apos;t load this dispute.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => refetch()}>Try again</Button>
          <Link href={listPath}>
            <Button variant="secondary">All disputes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { contract } = dispute;
  const counterpart = role === "CLIENT" ? contract.freelancer : contract.client;
  const openedByMe = dispute.openedBy.id === user?.id;
  const previous = dispute.previousContractStatus
    ? contractStatusLabels[dispute.previousContractStatus]
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={listPath}
          className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All disputes
        </Link>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1>Dispute</h1>
            <p className="text-text-secondary mt-1">{contract.job.title}</p>
          </div>
          <DisputeStatusBadge status={dispute.status} />
        </div>
      </div>

      {dispute.status === "OPEN" && (
        <Alert variant="warning">
          This dispute is open. The contract is paused while an admin reviews
          it, and you&apos;ll be notified of the outcome.
        </Alert>
      )}

      {dispute.status === "WITHDRAWN" && (
        <Alert variant="info">
          {openedByMe ? "You withdrew" : `${dispute.openedBy.name} withdrew`}{" "}
          this dispute
          {previous
            ? `, and the contract went back to ${previous.toLowerCase()}.`
            : "."}
        </Alert>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3>Contract</h3>
          {contract.status && <ContractStatusBadge status={contract.status} />}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Party
            label="Client"
            party={contract.client}
            href={`/clients/${contract.client.id}`}
            accent="client"
          />
          <Party
            label="Freelancer"
            party={contract.freelancer}
            href={`/freelancers/${contract.freelancer.id}`}
            accent="freelancer"
          />
        </div>

        <div className="border-border mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
          <span className="text-text-secondary">
            Agreed budget{" "}
            <span className="text-text-primary font-semibold">
              {formatMoney(contract.agreedBudget)}
            </span>
          </span>
          <div className="flex flex-wrap gap-2">
            <Link href={`${contractsPath}/${contract.id}`}>
              <Button size="sm" variant="secondary">
                View contract
              </Button>
            </Link>
            <MessageButton
              jobId={contract.job.id}
              otherUserId={counterpart.id}
              size="sm"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <Avatar
            name={dispute.openedBy.name}
            imageUrl={dispute.openedBy.imageUrl}
            size="sm"
            accent={
              dispute.openedBy.id === contract.client.id
                ? "client"
                : "freelancer"
            }
          />
          <div>
            <p className="text-text-primary text-sm font-medium">
              {openedByMe ? "You" : dispute.openedBy.name} opened this dispute
            </p>
            <p className="text-text-secondary text-xs">
              {formatContractDate(dispute.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-text-secondary mt-4 text-sm whitespace-pre-line">
          {dispute.reason}
        </p>

        {dispute.status === "OPEN" && openedByMe && (
          <div className="mt-4">
            <WithdrawDisputeButton dispute={dispute} size="md" />
          </div>
        )}
      </Card>

      {dispute.status === "RESOLVED" && (
        <Card>
          <h3>Resolution</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {dispute.resolution && (
              <Badge variant="brand">
                {disputeResolutionLabels[dispute.resolution]}
              </Badge>
            )}
            {dispute.resolvedAt && (
              <span className="text-text-secondary text-xs">
                Resolved {formatContractDate(dispute.resolvedAt)}
              </span>
            )}
          </div>

          {dispute.resolutionNote ? (
            <p className="text-text-secondary mt-3 text-sm whitespace-pre-line">
              {dispute.resolutionNote}
            </p>
          ) : (
            <p className="text-text-secondary mt-3 text-sm">
              No note was left with this resolution.
            </p>
          )}

          {dispute.refundStatus && (
            <div className="mt-4">
              <Alert
                variant={
                  dispute.refundStatus === "SUCCEEDED"
                    ? "success"
                    : dispute.refundStatus === "FAILED"
                      ? "warning"
                      : "info"
                }
              >
                <p className="font-medium">
                  {refundStatusLabels[dispute.refundStatus]}
                </p>
                {dispute.refundStatus === "FAILED" && (
                  <p className="mt-1">
                    The automatic refund didn&apos;t go through, so it needs
                    manual follow-up.
                  </p>
                )}
              </Alert>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
