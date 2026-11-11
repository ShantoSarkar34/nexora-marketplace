"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSignature, Lock, Percent, Wallet } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Avatar } from "@/components/shared/avatar";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import {
  SummaryTile,
  SummaryTileSkeleton,
} from "@/features/payments/components/summary-tile";
import { formatMoney, formatPaymentDate } from "@/features/payments/utils";
import { useEarnings, useEarningsTransactions } from "@/hooks/use-payments";

const PAGE_SIZE = 10;

export function FreelancerEarnings() {
  const [page, setPage] = useState(1);
  const earnings = useEarnings();
  const transactions = useEarningsTransactions({ page, limit: PAGE_SIZE });

  const rows = transactions.data?.transactions ?? [];
  const totalPages = transactions.data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1>Earnings</h1>
        <p className="text-text-secondary mt-1">
          What you&apos;ve earned from your contracts, after the platform fee.
        </p>
      </div>

      <Alert variant="info">
        Your earnings are a recorded balance. Nexora doesn&apos;t send payouts
        yet.
      </Alert>

      {earnings.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SummaryTileSkeleton key={index} />
          ))}
        </div>
      ) : earnings.isError || !earnings.data ? (
        <div className="border-border bg-surface flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3">
          <p className="text-text-secondary text-sm">
            We couldn&apos;t load your earnings summary.
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => earnings.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryTile
            label="Total earned"
            value={formatMoney(earnings.data.totalEarned)}
            hint="From completed contracts, after fees"
            icon={<Wallet className="h-5 w-5" />}
            accent="freelancer"
          />
          <SummaryTile
            label="In escrow"
            value={formatMoney(earnings.data.inEscrow)}
            hint="Paid by the client, waiting for approval"
            icon={<Lock className="h-5 w-5" />}
            accent="freelancer"
          />
          <SummaryTile
            label="Platform fees"
            value={formatMoney(earnings.data.platformFeesPaid)}
            hint="Deducted from your earnings"
            icon={<Percent className="h-5 w-5" />}
            accent="freelancer"
          />
          <SummaryTile
            label="Completed contracts"
            value={String(earnings.data.completedContracts)}
            icon={<FileSignature className="h-5 w-5" />}
            accent="freelancer"
          />
        </div>
      )}

      <div>
        <h2 className="text-text-primary text-lg font-semibold">
          Transactions
        </h2>

        {transactions.isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : transactions.isError ? (
          <div className="border-border bg-surface mt-4 rounded-md border px-6 py-10 text-center">
            <p className="text-text-secondary text-sm">
              We couldn&apos;t load your transactions.
            </p>
            <Button
              className="mt-4"
              size="sm"
              variant="secondary"
              onClick={() => transactions.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<Wallet className="h-6 w-6" />}
              title="No earnings yet"
              description="Payments appear here once a client pays for a contract you're working on."
              actionLabel="View contracts"
              actionHref="/freelancer/contracts"
            />
          </div>
        ) : (
          <>
            <Card className="mt-4 overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-3xl text-left text-sm">
                  <thead>
                    <tr className="border-border text-text-secondary border-b text-xs">
                      <th scope="col" className="px-4 py-3 font-medium">
                        Job
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Client
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium"
                      >
                        Gross
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium"
                      >
                        Fee
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium"
                      >
                        Net
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Contract
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-border border-b last:border-0"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/freelancer/contracts/${tx.contractId}`}
                            className="text-text-primary hover:text-brand-600 font-medium"
                          >
                            {tx.jobTitle}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={tx.client.name}
                              imageUrl={tx.client.imageUrl}
                              size="sm"
                              accent="client"
                            />
                            <span className="text-text-secondary">
                              {tx.client.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatMoney(tx.gross)}
                        </td>
                        <td className="text-text-secondary px-4 py-3 text-right tabular-nums">
                          −{formatMoney(tx.fee)}{" "}
                          <span className="text-xs">({tx.feePercent}%)</span>
                        </td>
                        <td className="text-text-primary px-4 py-3 text-right font-semibold tabular-nums">
                          {formatMoney(tx.net)}
                        </td>
                        <td className="px-4 py-3">
                          <ContractStatusBadge status={tx.contractStatus} />
                        </td>
                        <td className="text-text-secondary px-4 py-3 whitespace-nowrap">
                          {formatPaymentDate(tx.paidAt ?? tx.completedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <p className="text-text-secondary mt-3 text-xs">
              Net is the gross amount minus the platform fee. A payment counts
              as earned once the client approves the work; until then it is in
              escrow.
            </p>

            <div className="pt-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
