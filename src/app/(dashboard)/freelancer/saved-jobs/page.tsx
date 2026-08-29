"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { JobCard } from "@/features/jobs/components/job-card";
import { useSavedJobs } from "@/hooks/use-jobs";

const PAGE_SIZE = 10;

export default function SavedJobsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSavedJobs({ page, limit: PAGE_SIZE });
  const jobs = data?.jobs ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1>Saved Jobs</h1>
        <p className="text-text-secondary mt-1">
          Jobs you&apos;ve bookmarked to review later.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6" />}
          title="No saved jobs yet"
          description="Save jobs while browsing to find them here later."
          actionLabel="Browse jobs"
          actionHref="/freelancer/jobs"
        />
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={{ ...job, isSaved: true }} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
