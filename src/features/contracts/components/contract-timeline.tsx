import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ContractStatus } from "@/types/contract";

const steps: { key: ContractStatus; label: string }[] = [
  { key: "PENDING", label: "Pending" },
  { key: "ACTIVE", label: "Active" },
  { key: "SUBMITTED", label: "Submitted" },
  { key: "COMPLETED", label: "Completed" },
];

export function ContractTimeline({ status }: { status: ContractStatus }) {
  if (status === "CANCELLED" || status === "DISPUTED") return null;

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const isDone = i <= currentIndex;
        return (
          <div
            key={step.key}
            className="flex flex-1 items-center last:flex-none"
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  isDone
                    ? "bg-brand-600 text-white"
                    : "bg-surface-muted text-text-secondary",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className="text-text-secondary text-xs">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  i < currentIndex ? "bg-brand-600" : "bg-surface-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
