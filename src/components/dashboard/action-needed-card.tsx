import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface ActionItem {
  id: string;
  count: number;
  // Already worded, for example "2 contracts awaiting payment".
  text: string;
  href: string;
}

interface ActionNeededCardProps {
  items: ActionItem[];
  isLoading?: boolean;
}

export function ActionNeededCard({ items, isLoading }: ActionNeededCardProps) {
  const visible = items.filter((item) => item.count > 0);

  return (
    <Card>
      <h3>Needs your attention</h3>

      <div className="mt-4">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="bg-surface-muted h-4 w-2/3 rounded" />
            <div className="bg-surface-muted h-4 w-1/2 rounded" />
          </div>
        ) : visible.length === 0 ? (
          <div className="text-text-secondary flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-status-active h-4 w-4 shrink-0" />
            You&apos;re all caught up.
          </div>
        ) : (
          <ul className="divide-border divide-y">
            {visible.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="text-text-primary hover:text-brand-600 flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <span>{item.text}</span>
                  <ChevronRight className="text-text-secondary h-4 w-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
