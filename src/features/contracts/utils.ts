import { formatMoney } from "@/features/payments/utils";
import type { Contract } from "@/types/contract";

export type ContractRole = "CLIENT" | "FREELANCER";

// "$800 fixed", "$35/hr", or just "$800" when the job's budget type is unknown.
export function formatContractBudget(
  contract: Pick<Contract, "agreedBudget" | "budgetType">,
) {
  const amount = formatMoney(contract.agreedBudget);
  if (contract.budgetType === "HOURLY") return `${amount}/hr`;
  if (contract.budgetType === "FIXED") return `${amount} fixed`;
  return amount;
}

export function formatContractDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// A contract the client has paid for stays PENDING until the backend confirms
// the payment. While that is the case the page keeps checking for the change.
export function isAwaitingActivation(
  contract?: Pick<Contract, "status" | "paymentStatus"> | null,
): boolean {
  return (
    contract?.status === "PENDING" &&
    (contract.paymentStatus === "SUCCESS" ||
      contract.paymentStatus === "PROCESSING")
  );
}

// Only http(s) links are safe to render as clickable. Anything else
// (javascript:, data:, a bare "example.com") is shown as plain text instead.
export function safeHttpUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export interface ContractHint {
  text: string;
  tone: "warning" | "info";
}

// The one-line "what happens next" shown on each row of the contracts list.
export function contractHint(
  contract: Contract,
  role: ContractRole,
): ContractHint | null {
  switch (contract.status) {
    case "PENDING":
      if (isAwaitingActivation(contract)) {
        return { text: "Payment is being confirmed", tone: "info" };
      }
      return role === "CLIENT"
        ? { text: "Payment required to activate this contract", tone: "warning" }
        : { text: "Waiting for the client to pay", tone: "info" };
    case "SUBMITTED":
      return role === "CLIENT"
        ? { text: "Work submitted — review it", tone: "warning" }
        : { text: "Waiting for the client to review your work", tone: "info" };
    case "DISPUTED":
      return { text: "Under dispute", tone: "warning" };
    default:
      return null;
  }
}