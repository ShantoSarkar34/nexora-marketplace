import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type CheckboxProps = Omit <
 React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "peer h-4 w-4 shrink-0 appearance-none rounded border border-border bg-surface checked:border-brand-600 checked:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            className,
          )}
          {...props}
        />
        <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
      </span>
    );
  },
);