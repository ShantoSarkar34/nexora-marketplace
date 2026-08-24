"use client";

import { CreditCard } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { mockPayments } from "@/lib/mock-data/payments";
import type { PaymentStatus } from "@/types/payment";

const statusVariant: Record<
  PaymentStatus,
  "success" | "warning" | "error" | "neutral"
> = {
  SUCCESS: "success",
  PENDING: "warning",
  FAILED: "error",
  CANCELLED: "neutral",
};

export default function PaymentsPage() {
  // Track B: replace with GET /payments?clientId=me
  const payments = mockPayments;

  return (
    <div className="space-y-6">
      <div>
        <h1>Payments</h1>
        <p className="text-text-secondary mt-1">
          Track payments across your contracts.
        </p>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" />}
          title="No payments yet"
          description="Payments you make for contracts will appear here."
        />
      ) : (
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
                    {p.freelancerName} · {p.createdAt} · {p.method}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-primary text-sm font-semibold">
                    ${p.amount}
                  </span>
                  <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
