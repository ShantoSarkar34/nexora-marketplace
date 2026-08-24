import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "border-border bg-surface text-text-primary focus-visible:ring-brand-500 h-10 w-full appearance-none rounded-md border px-3 pr-9 text-sm focus-visible:ring-2 focus-visible:outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="text-text-secondary pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
      </div>
    );
  },
);
