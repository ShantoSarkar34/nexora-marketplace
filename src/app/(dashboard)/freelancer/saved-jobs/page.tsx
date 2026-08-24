import { Bookmark } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function SavedJobsPage() {
  // Track B: replace with GET /jobs/saved — the mock "save" toggle on
  // JobCard doesn't persist anywhere yet, since there's no global state
  // or backend for it in Track A.
  return (
    <div className="space-y-6">
      <div>
        <h1>Saved Jobs</h1>
        <p className="mt-1 text-text-secondary">
          Jobs you&apos;ve bookmarked to review later.
        </p>
      </div>
      <EmptyState
        icon={<Bookmark className="h-6 w-6" />}
        title="No saved jobs yet"
        description="Save jobs while browsing to find them here later."
        actionLabel="Browse jobs"
        actionHref="/freelancer/jobs"
      />
    </div>
  );
}