import type { ContractRole } from "@/features/contracts/utils";
import type { ContractStatus } from "@/types/enums";

// A dispute can only be opened while work is in progress or waiting for review.
export function canOpenDispute(status: ContractStatus): boolean {
  return status === "ACTIVE" || status === "SUBMITTED";
}

export function disputesBasePath(role: ContractRole): string {
  return role === "CLIENT" ? "/client/disputes" : "/freelancer/disputes";
}

export function byNewest<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
