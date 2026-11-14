import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import {
  formatContractBudget,
  formatContractDate,
} from "@/features/contracts/utils";
import { PaymentStatusBadge } from "@/features/payments/status-badge";
import type { Contract } from "@/types/contract";

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-text-secondary text-xs">{label}</dt>
      <dd className="text-text-primary mt-1 text-sm font-semibold">
        {children}
      </dd>
    </div>
  );
}

export function ContractSummaryCard({ contract }: { contract: Contract }) {
  const showSubmitted =
    !!contract.submittedAt &&
    (contract.status === "SUBMITTED" || contract.status === "COMPLETED");

  return (
    <Card>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <Item label="Agreed budget">{formatContractBudget(contract)}</Item>
        <Item label="Started">{formatContractDate(contract.createdAt)}</Item>
        <Item label="Payment">
          {contract.paymentStatus ? (
            <PaymentStatusBadge status={contract.paymentStatus} />
          ) : (
            <span className="text-text-secondary font-normal">
              {contract.status === "PENDING" ? "Not paid yet" : "—"}
            </span>
          )}
        </Item>
        {showSubmitted && (
          <Item label="Submitted">
            {formatContractDate(contract.submittedAt)}
          </Item>
        )}
        {contract.completedAt && (
          <Item label="Completed">
            {formatContractDate(contract.completedAt)}
          </Item>
        )}
        {contract.cancelledAt && (
          <Item label="Cancelled">
            {formatContractDate(contract.cancelledAt)}
          </Item>
        )}
      </dl>
    </Card>
  );
}
