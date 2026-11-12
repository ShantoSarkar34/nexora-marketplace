import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface BreakdownRow {
  key: string;
  label: string;
  count: number;
}

interface StatusBreakdownCardProps {
  title: string;
  total?: number;
  rows: BreakdownRow[];
  footerHref?: string;
  footerLabel?: string;
}

export function StatusBreakdownCard({
  title,
  total,
  rows,
  footerHref,
  footerLabel,
}: StatusBreakdownCardProps) {
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <h3>{title}</h3>
        {total !== undefined && (
          <span className="text-text-secondary text-sm">{total} total</span>
        )}
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span
              className={cn(
                row.count > 0 ? "text-text-primary" : "text-text-secondary",
              )}
            >
              {row.label}
            </span>
            <span
              className={cn(
                "tabular-nums",
                row.count > 0
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary",
              )}
            >
              {row.count}
            </span>
          </li>
        ))}
      </ul>

      {footerHref && footerLabel && (
        <Link href={footerHref} className="mt-4 block text-sm font-medium">
          {footerLabel}
        </Link>
      )}
    </Card>
  );
}