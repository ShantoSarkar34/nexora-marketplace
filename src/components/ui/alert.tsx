import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex items-start gap-3 rounded-md border p-4 text-sm",
  {
    variants: {
      variant: {
        success: "border-status-active/30 bg-status-active/10",
        error: "border-status-error/30 bg-status-error/10",
        info: "border-brand-500/30 bg-brand-50",
        warning: "border-status-pending/30 bg-status-pending/10",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

const iconColors = {
  success: "text-status-active",
  error: "text-status-error",
  info: "text-brand-600",
  warning: "text-status-pending",
} as const;

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({
  className,
  variant = "info",
  children,
  ...props
}: AlertProps) {
  const v = variant ?? "info";
  const Icon = icons[v];
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColors[v])} />
      <div className="text-text-primary">{children}</div>
    </div>
  );
}
