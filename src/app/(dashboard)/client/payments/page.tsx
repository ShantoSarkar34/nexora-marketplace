"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { PaymentStatusBadge } from "@/features/payments/status-badge";
import { paymentStatusLabels } from "@/types/enums";
import { useMyPayments } from "@/hooks/use-payments";
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
  const payments = data?.payments ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Payments</h1>
          <p className="text-text-secondary mt-1">
            Track payments across your contracts.
          </p>
        </div>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as PaymentStatus | "ALL");
            setPage(1);
          }}
          className="w-44"
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
          title="No payments yet"
          description="Payments you make for contracts will appear here."
        />
      ) : (
        <>
          <Card className="p-0">
            <div className="divide-border divide-y">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="text-text-primary text-sm font-medium">
                      {p.jobTitle}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {p.freelancerName} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-primary text-sm font-semibold">
                      ${p.amount}
                    </span>
                    <PaymentStatusBadge status={p.status} />
                  </div>
                </div>
              ))}
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
  );
}
