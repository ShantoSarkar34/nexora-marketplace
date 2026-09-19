"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { applicationStatusLabels } from "@/types/enums";
import { getInitials } from "@/lib/get-initials";
import { useMyJobs } from "@/hooks/use-jobs";
import { applicationsService } from "@/services/applications";
import type { ApplicationStatus } from "@/types/enums";

const ALL_JOBS = "ALL";

function ClientApplicationsContent() {
  const searchParams = useSearchParams();
  const { data: jobsData, isLoading: jobsLoading } = useMyJobs({ limit: 50 });
  const publishedJobs = (jobsData?.jobs ?? []).filter(
    (j) => j.status !== "DRAFT",
  );

  const [selectedJobId, setSelectedJobId] = useState(
    searchParams.get("jobId") || ALL_JOBS,
  );
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const jobIdsToFetch =
    selectedJobId === ALL_JOBS
      ? publishedJobs.map((j) => j.id)
      : [selectedJobId];

  const results = useQueries({
    queries: jobIdsToFetch.map((jobId) => ({
      queryKey: ["applications", "job", jobId],
      queryFn: () => applicationsService.forJob(jobId),
      enabled: !!jobId,
    })),
  });

  const isLoadingApplicants = results.some((r) => r.isLoading);

  const applicants = useMemo(() => {
    let all = results.flatMap((r) => r.data ?? []);
    if (statusFilter !== "ALL") {
      all = all.filter((a) => a.status === statusFilter);
    }
    all = [...all].sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortBy === "newest" ? diff : -diff;
    });
    return all;
  }, [results.map((r) => r.dataUpdatedAt).join(","), statusFilter, sortBy]);

  // console.log(applicants)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Applications</h1>
          <p className="text-text-secondary mt-1">
            Review applicants across your jobs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {publishedJobs.length > 0 && (
            <Select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-56"
            >
              <option value={ALL_JOBS}>All my jobs</option>
              {publishedJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </Select>
          )}
          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ApplicationStatus | "ALL")
            }
            className="w-40"
          >
            <option value="ALL">All statuses</option>
            {Object.entries(applicationStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            className="w-40"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </Select>
        </div>
      </div>

      {jobsLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : publishedJobs.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No published jobs yet"
          description="Publish a job to start receiving applications."
          actionLabel="View my jobs"
          actionHref="/client/jobs"
        />
      ) : isLoadingApplicants ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No applications found"
          description="Applications matching this filter will appear here."
        />
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <Link key={app.id} href={`/client/applications/${app.id}`}>
              <Card className="hover:border-brand-300 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-100 text-brand-700 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                      {getInitials(app.freelancerName)}
                    </span>
                    <div>
                      <p className="text-text-primary text-sm font-semibold">
                        {app.freelancerName}
                      </p>
                      <p className="text-text-secondary text-xs">
                        Applied for {app.jobTitle} · ${app.proposedBudget}
                      </p>
                    </div>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <ClientApplicationsContent />
    </Suspense>
  );
}
