import { Card } from "@/components/ui/card";

export function ProfileCompletionCard({ percentage }: { percentage: number }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-text-primary text-sm font-medium">
          Profile completion
        </p>
        <span className="text-brand-600 text-sm font-semibold">
          {percentage}%
        </span>
      </div>
      <div className="bg-surface-muted mt-3 h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-brand-600 h-full rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-text-secondary mt-2 text-xs">
        Add your skills and portfolio to improve your match score.
      </p>
    </Card>
  );
}
