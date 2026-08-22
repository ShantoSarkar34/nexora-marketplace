export function MatchPreviewCard() {
  return (
    <div className="mx-auto w-full max-w-md rounded-card border border-border bg-surface p-6 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-text-secondary">
            Freelancer
          </p>
          <p className="text-sm font-semibold text-text-primary">Sarah K.</p>
          <p className="text-xs text-text-secondary">
            React · TypeScript · Node.js
          </p>
        </div>
        <div className="flex h-14 w-14 shrink-0 animate-pulse items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
          94%
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-text-secondary">Job</p>
          <p className="text-sm font-semibold text-text-primary">
            Frontend Engineer
          </p>
          <p className="text-xs text-text-secondary">React · TS · REST APIs</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-md bg-status-active/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-status-active" />
        <span className="text-xs font-medium text-text-primary">
          Strong skill match — 3 shared requirements
        </span>
      </div>
    </div>
  );
}