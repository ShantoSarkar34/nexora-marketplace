import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "border-border bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-500 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);
