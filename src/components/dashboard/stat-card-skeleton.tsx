import { Card } from "@/components/ui/card";

export function StatCardSkeleton() {
  return (
    <Card className="flex animate-pulse items-center gap-4">
      <div className="bg-surface-muted h-11 w-11 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="bg-surface-muted h-6 w-1/3 rounded" />
        <div className="bg-surface-muted h-3 w-2/3 rounded" />
      </div>
    </Card>
  );
}
