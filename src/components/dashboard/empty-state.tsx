import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-card border-border flex flex-col items-center justify-center gap-3 border border-dashed py-12 text-center">
      <div className="bg-surface-muted text-text-secondary flex h-12 w-12 items-center justify-center rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-text-primary text-sm font-medium">{title}</p>
        <p className="text-text-secondary mt-1 text-sm">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm" className="mt-2">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
