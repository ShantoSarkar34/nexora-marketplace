"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatContractDate } from "@/features/contracts/utils";
import { DisputeStatusBadge } from "@/features/disputes/components/dispute-status-badge";
import { formatMoney } from "@/features/payments/utils";
import { useAdminDisputes } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";
import {
  disputeResolutionLabels,
  disputeStatusLabels,
  type DisputeStatus,
} from "@/types/enums";

const PAGE_SIZE = 10;

export function AdminDisputesList() {
  // Open disputes are the queue that needs attention, so start there.
  const [status, setStatus] = useState<DisputeStatus | "ALL">("OPEN");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useAdminDisputes({ status, page, limit: PAGE_SIZE });

  const disputes = data?.disputes ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Disputes</h1>
          <p className="text-text-secondary mt-1">
            {isLoading
              ? "Loading disputes..."
              : `${total} ${status === "ALL" ? "" : `${disputeStatusLabels[status].toLowerCase()} `}dispute${total === 1 ? "" : "s"}`}
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
            We couldn&apos;t load disputes.
          </p>
          <Button className="mt-5" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : disputes.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={<Scale className="h-6 w-6" />}
            title={status === "OPEN" ? "No open disputes" : "No disputes found"}
            description={
              status === "OPEN"
                ? "Nothing needs review right now."
                : "Disputes with this status will appear here."
            }
          />
          {status === "OPEN" && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setStatus("ALL");
                  setPage(1);
                }}
              >
                Show all disputes
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            className={cn(
              "space-y-4",
              isPlaceholderData && "opacity-60 transition-opacity",
            )}
          >
            {disputes.map((dispute) => (
              <Link
                key={dispute.id}
                href={`/admin/disputes/${dispute.id}`}
                className="block"
              >
                <Card className="hover:border-brand-300 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-text-primary truncate text-base font-semibold">
                        {dispute.contract.job.title}
                      </h3>
                      <p className="text-text-secondary mt-1 text-xs">
                        Client:{" "}
                        <span className="text-text-primary font-medium">
                          {dispute.contract.client.name}
                        </span>{" "}
                        · Freelancer:{" "}
                        <span className="text-text-primary font-medium">
                          {dispute.contract.freelancer.name}
                        </span>
                      </p>
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
                    Opened by {dispute.openedBy.name} on{" "}
                    {formatContractDate(dispute.createdAt)}
                    {dispute.status === "RESOLVED" &&
                      dispute.resolution &&
                      ` · ${disputeResolutionLabels[dispute.resolution]}`}
                  </p>
                </Card>
              </Link>
            ))}
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
