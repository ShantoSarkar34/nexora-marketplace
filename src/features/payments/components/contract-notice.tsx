"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  formatContractDate,
  type ContractRole,
} from "@/features/contracts/utils";
import { PayNowButton } from "@/features/payments/components/pay-now-button";
import type { Contract } from "@/types/contract";

function CheckStatusButton({ contractId }: { contractId: string }) {
  const qc = useQueryClient();
  const [checking, setChecking] = useState(false);

  async function check() {
    setChecking(true);
    try {
      await qc.invalidateQueries({
        queryKey: ["contracts", "detail", contractId],
      });
    } finally {
      setChecking(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={check}
      isLoading={checking}
    >
      Check status
    </Button>
  );
}

function ClientPendingNotice({ contract }: { contract: Contract }) {
  const payment = contract.paymentStatus;

  // Paid, and the backend is about to flip the contract to ACTIVE.
  if (payment === "SUCCESS") {
    return (
      <Alert variant="success">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Payment received. We&apos;re activating the contract, which usually
            takes a few seconds.
          </span>
          <CheckStatusButton contractId={contract.id} />
        </div>
      </Alert>
    );
  }

  // Mid-confirmation: offering Pay here could charge twice.
  if (payment === "PROCESSING") {
    return (
      <Alert variant="info">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Your payment is being processed. The contract activates
            automatically once it&apos;s confirmed.
          </span>
          <CheckStatusButton contractId={contract.id} />
        </div>
      </Alert>
    );
  }

  const message =
    payment === "FAILED"
      ? "Your last payment didn't go through. You can try again."
      : payment === "CANCELLED"
        ? "You left checkout before paying, so nothing was charged."
        : payment === "REFUNDED"
          ? "Your last payment was refunded."
          : payment === "PENDING"
            ? "A checkout was started but isn't confirmed yet. If you didn't finish paying, you can start again."
            : `This contract is waiting for your payment. Pay to activate it and let ${contract.freelancerName} start work.`;

  return (
    <Alert
      variant={
        payment === "FAILED" || payment === "REFUNDED" ? "warning" : "info"
      }
    >
      <div className="space-y-3">
        <p>{message}</p>
        <div className="flex flex-wrap items-center gap-3">
          <PayNowButton
            contractId={contract.id}
            label={payment ? "Pay Again" : "Pay Now"}
          />
          {payment === "PENDING" && (
            <CheckStatusButton contractId={contract.id} />
          )}
        </div>
        {payment === "PENDING" && (
          <p className="text-text-secondary text-xs">
            Already paid? Confirmation can take a moment. Use Check status
            before paying again.
          </p>
        )}
      </div>
    </Alert>
  );
}

function FreelancerPendingNotice({ contract }: { contract: Contract }) {
  const payment = contract.paymentStatus;

  if (payment === "SUCCESS" || payment === "PROCESSING") {
    return (
      <Alert variant="success">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            The client&apos;s payment is being confirmed. This contract will
            activate automatically.
          </span>
          <CheckStatusButton contractId={contract.id} />
        </div>
      </Alert>
    );
  }

  return (
    <Alert variant="info">
      You&apos;ve been hired! This contract will activate automatically once{" "}
      {contract.clientName} completes payment.
    </Alert>
  );
}

// The banner that explains where a contract stands. It returns nothing for
// states that need no explanation.
export function ContractNotice({
  contract,
  role,
}: {
  contract: Contract;
  role: ContractRole;
}) {
  switch (contract.status) {
    case "PENDING":
      return role === "CLIENT" ? (
        <ClientPendingNotice contract={contract} />
      ) : (
        <FreelancerPendingNotice contract={contract} />
      );

    case "SUBMITTED":
      return role === "FREELANCER" ? (
        <Alert variant="info">
          Your work is with {contract.clientName} for review. You&apos;ll be
          notified when they respond.
        </Alert>
      ) : null;

    case "DISPUTED":
      return (
        <Alert variant="warning">
          This contract is under dispute. Submitting work, approving, requesting
          revisions, and cancelling are paused while it&apos;s reviewed.
          You&apos;ll be notified of the outcome.
        </Alert>
      );

    case "CANCELLED":
      return (
        <Alert variant="error">
          <p>
            This contract was cancelled
            {contract.cancelledAt
              ? ` on ${formatContractDate(contract.cancelledAt)}`
              : ""}
            .
          </p>
          {contract.cancelReason && (
            <p className="text-text-secondary mt-1">
              Reason: {contract.cancelReason}
            </p>
          )}
        </Alert>
      );

    default:
      return null;
  }
}
