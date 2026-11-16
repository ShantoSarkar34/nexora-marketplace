"use client";

import Link from "next/link";
import { Scale } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DisputeStatusBadge } from "@/features/disputes/components/dispute-status-badge";
import { WithdrawDisputeButton } from "@/features/disputes/components/withdraw-dispute-button";
import { byNewest, disputesBasePath } from "@/features/disputes/utils";
import {
  formatContractDate,
  type ContractRole,
} from "@/features/contracts/utils";
import { useAuth } from "@/hooks/use-auth";
import { useContractDisputes } from "@/hooks/use-disputes";
import { disputeResolutionLabels } from "@/types/enums";
import type { Contract } from "@/types/contract";

export function ContractDisputeSection({
  contract,
  role,
}: {
  contract: Contract;
  role: ContractRole;
}) {
  const { user } = useAuth();
  // A contract that hasn't started can't have a dispute.
  const enabled = contract.status !== "PENDING";
  const query = useContractDisputes(contract.id, enabled);

  if (!enabled) return null;

  const isDisputed = contract.status === "DISPUTED";
  const basePath = disputesBasePath(role);

  if (query.isLoading) {
    return isDisputed ? (
      <Card className="animate-pulse">
        <div className="bg-surface-muted h-4 w-1/3 rounded" />
        <div className="bg-surface-muted mt-4 h-3 w-full rounded" />
        <div className="bg-surface-muted mt-2 h-3 w-2/3 rounded" />
      </Card>
    ) : null;
  }

  if (query.isError) {
    return isDisputed ? (
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-text-secondary text-sm">
            We couldn&apos;t load the dispute details.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => query.refetch()}
            >
              Try again
            </Button>
            <Link href={basePath}>
              <Button size="sm" variant="secondary">
                All disputes
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    ) : null;
  }

  const disputes = byNewest(query.data ?? []);
  const openDispute = disputes.find((dispute) => dispute.status === "OPEN");

  if (openDispute) {
    const openedByMe = openDispute.openedBy.id === user?.id;

    return (
      <Card className="border-status-pending/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="text-status-pending h-4 w-4" />
            <h3>Dispute</h3>
          </div>
          <DisputeStatusBadge status={openDispute.status} />
        </div>

        <p className="text-text-secondary mt-3 text-xs">
          Opened by{" "}
          <span className="text-text-primary font-medium">
            {openedByMe ? "you" : openDispute.openedBy.name}
          </span>{" "}
          on {formatContractDate(openDispute.createdAt)}
        </p>
        <p className="text-text-secondary mt-2 line-clamp-6 text-sm whitespace-pre-line">
          {openDispute.reason}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`${basePath}/${openDispute.id}`}>
            <Button size="sm" variant="secondary">
              View dispute
            </Button>
          </Link>
          <WithdrawDisputeButton dispute={openDispute} />
        </div>
      </Card>
    );
  }

  // No open dispute: show the record of earlier ones, if there are any.
  if (disputes.length === 0) return null;

  return (
    <Card>
      <h3>Dispute history</h3>
      <ul className="divide-border mt-3 divide-y">
        {disputes.slice(0, 5).map((dispute) => (
          <li key={dispute.id}>
            <Link
              href={`${basePath}/${dispute.id}`}
              className="hover:text-brand-600 flex items-center justify-between gap-3 py-2.5 text-sm"
            >
              <span className="text-text-primary min-w-0">
                Opened {formatContractDate(dispute.createdAt)}
                {dispute.status === "RESOLVED" && dispute.resolution && (
                  <span className="text-text-secondary">
                    {" "}
                    · {disputeResolutionLabels[dispute.resolution]}
                  </span>
                )}
              </span>
              <DisputeStatusBadge status={dispute.status} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
