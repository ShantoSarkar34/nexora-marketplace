import { Button } from "@/components/ui/button";

export function StatsLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="border-border bg-surface flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3">
      <p className="text-text-secondary text-sm">
        We couldn&apos;t load your dashboard numbers.
      </p>
      <Button size="sm" variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
