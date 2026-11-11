"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ClientSpendingSummary } from "@/features/payments/components/client-spending-summary";
import { PaymentStatusBadge } from "@/features/payments/status-badge";
import { formatMoney, formatPaymentDate } from "@/features/payments/utils";
import { useMyContracts } from "@/hooks/use-contracts";
import { useMyPayments } from "@/hooks/use-payments";
import { paymentStatusLabels } from "@/types/enums";
import type { PaymentStatus } from "@/types/enums";

const PAGE_SIZE = 10;

export default function PaymentsPage() {
  const [filter, setFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMyPayments({
    status: filter,
    page,
    limit: PAGE_SIZE,
  });
  const { data: contracts } = useMyContracts();

  const payments = data?.payments ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  // A payment only carries a contract id, so job title and freelancer come
  // from the contracts list. A contract outside that list shows a generic
  // title.
  const contractById = useMemo(
    () => new Map((contracts ?? []).map((contract) => [contract.id, contract])),
    [contracts],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>Payments</h1>
        <p className="text-text-secondary mt-1">
          Track what you&apos;ve paid and what&apos;s held in escrow.
        </p>
      </div>

      <ClientSpendingSummary />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-text-primary text-lg font-semibold">
            Payment history
          </h2>
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as PaymentStatus | "ALL");
              setPage(1);
            }}
            className="w-44"
            aria-label="Filter payments by status"
          >
            <option value="ALL">All statuses</option>
            {Object.entries(paymentStatusLabels).map(([value, label]) => (
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
        ) : payments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-6 w-6" />}
            title={filter === "ALL" ? "No payments yet" : "No payments found"}
            description={
              filter === "ALL"
                ? "Payments you make for contracts will appear here."
                : "Payments with this status will appear here."
            }
            actionLabel="View contracts"
            actionHref="/client/contracts"
          />
        ) : (
          <>
            <Card className="p-0">
              <div className="divide-border divide-y">
                {payments.map((payment) => {
                  const contract = contractById.get(payment.contractId);
                  const title =
                    payment.jobTitle ??
                    contract?.jobTitle ??
                    "Contract payment";
                  const freelancer =
                    payment.freelancerName ?? contract?.freelancerName;

                  return (
                    <Link
                      key={payment.id}
                      href={`/client/contracts/${payment.contractId}`}
                      className="hover:bg-surface-muted flex flex-wrap items-center justify-between gap-3 p-4 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-text-primary truncate text-sm font-medium">
                          {title}
                        </p>
                        <p className="text-text-secondary text-xs">
                          {freelancer ? `${freelancer} · ` : ""}
                          {formatPaymentDate(
                            payment.paidAt ?? payment.createdAt,
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-primary text-sm font-semibold tabular-nums">
                          {formatMoney(payment.amount, payment.currency)}
                        </span>
                        <PaymentStatusBadge status={payment.status} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
