"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Avatar } from "@/components/shared/avatar";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  formatContractDate,
  type ContractRole,
} from "@/features/contracts/utils";
import { DisputeStatusBadge } from "@/features/disputes/components/dispute-status-badge";
import { disputesBasePath } from "@/features/disputes/utils";
import { formatMoney } from "@/features/payments/utils";
import { useAuth } from "@/hooks/use-auth";
import { useDisputes } from "@/hooks/use-disputes";
import {
  disputeResolutionLabels,
  disputeStatusLabels,
  type DisputeStatus,
} from "@/types/enums";

const PAGE_SIZE = 10;

export function DisputesList({ role }: { role: ContractRole }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<DisputeStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useDisputes({
    status,
    page,
    limit: PAGE_SIZE,
  });

  const disputes = data?.disputes ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const basePath = disputesBasePath(role);
  const contractsPath =
    role === "CLIENT" ? "/client/contracts" : "/freelancer/contracts";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Disputes</h1>
          <p className="text-text-secondary mt-1">
            Disputes on your contracts. Open one from a contract when something
            goes wrong.
          </p>
        </div>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as DisputeStatus | "ALL");
            setPage(1);
          }}
          className="w-44"
          aria-label="Filter disputes by status"
        >
          <option value="ALL">All statuses</option>
          {Object.entries(disputeStatusLabels).map(([value, label]) => (
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
      ) : isError && !data ? (
        <div className="border-border bg-surface rounded-md border px-6 py-12 text-center">
          <p className="text-text-primary font-medium">
            We couldn&apos;t load your disputes.
          </p>
          <Button className="mt-5" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : disputes.length === 0 ? (
        <EmptyState
          icon={<Scale className="h-6 w-6" />}
          title={status === "ALL" ? "No disputes" : "No disputes found"}
          description={
            status === "ALL"
              ? "If something goes wrong on a contract, you can open a dispute from its page."
              : "Disputes with this status will appear here."
          }
          actionLabel={status === "ALL" ? "View contracts" : undefined}
          actionHref={status === "ALL" ? contractsPath : undefined}
        />
      ) : (
        <>
          <div className="space-y-4">
            {disputes.map((dispute) => {
              const counterpart =
                role === "CLIENT"
                  ? dispute.contract.freelancer
                  : dispute.contract.client;
              const counterpartLabel =
                role === "CLIENT" ? "Freelancer" : "Client";
              const openedByMe = dispute.openedBy.id === user?.id;

              return (
                <Link
                  key={dispute.id}
                  href={`${basePath}/${dispute.id}`}
                  className="block"
                >
                  <Card className="hover:border-brand-300 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          name={counterpart.name}
                          imageUrl={counterpart.imageUrl}
                          accent={role === "CLIENT" ? "freelancer" : "client"}
                        />
                        <div className="min-w-0">
                          <h3 className="text-text-primary truncate text-base font-semibold">
                            {dispute.contract.job.title}
                          </h3>
                          <p className="text-text-secondary mt-0.5 text-xs">
                            {counterpartLabel}:{" "}
                            <span className="text-text-primary font-medium">
                              {counterpart.name}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <DisputeStatusBadge status={dispute.status} />
                        <span className="text-text-primary text-xs font-medium">
                          {formatMoney(dispute.contract.agreedBudget)}
                        </span>
                      </div>
                    </div>

                    <p className="text-text-secondary mt-3 line-clamp-2 text-sm">
                      {dispute.reason}
                    </p>

                    <p className="text-text-secondary mt-3 text-xs">
                      Opened by {openedByMe ? "you" : dispute.openedBy.name} on{" "}
                      {formatContractDate(dispute.createdAt)}
                      {dispute.status === "RESOLVED" &&
                        dispute.resolution &&
                        ` · ${disputeResolutionLabels[dispute.resolution]}`}
                    </p>
                  </Card>
                </Link>
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
