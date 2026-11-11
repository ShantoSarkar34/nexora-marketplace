"use client";

import { CheckCircle2, FileSignature, Lock, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SummaryTile,
  SummaryTileSkeleton,
} from "@/features/payments/components/summary-tile";
import { formatMoney } from "@/features/payments/utils";
import { useSpending } from "@/hooks/use-payments";

export function ClientSpendingSummary() {
  const { data, isLoading, isError, refetch } = useSpending();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SummaryTileSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="border-border bg-surface flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3">
        <p className="text-text-secondary text-sm">
          We couldn&apos;t load your spending summary.
        </p>
        <Button size="sm" variant="secondary" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  // Round to cents so adding two decimals never shows 0.30000000000000004.
  const totalPaid = Math.round((data.totalSpent + data.inEscrow) * 100) / 100;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryTile
        label="Total paid"
        value={formatMoney(totalPaid)}
        hint="Everything you've paid so far"
        icon={<Wallet className="h-5 w-5" />}
        accent="client"
      />
      <SummaryTile
        label="Spent on completed work"
        value={formatMoney(data.totalSpent)}
        hint="Contracts you've approved"
        icon={<CheckCircle2 className="h-5 w-5" />}
        accent="client"
      />
      <SummaryTile
        label="In escrow"
        value={formatMoney(data.inEscrow)}
        hint="Paid, but the work isn't approved yet"
        icon={<Lock className="h-5 w-5" />}
        accent="client"
      />
      <SummaryTile
        label="Completed contracts"
        value={String(data.completedContracts)}
        icon={<FileSignature className="h-5 w-5" />}
        accent="client"
      />
    </div>
  );
}
