"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { JobModerationDialog } from "@/features/admin/components/job-moderation-dialog";
import { formatContractDate } from "@/features/contracts/utils";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { formatMoney } from "@/features/payments/utils";
import { useAdminJobs } from "@/hooks/use-admin";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import {
  jobCategoryLabels,
  jobStatusLabels,
  type JobStatus,
} from "@/types/enums";
import type { AdminJob } from "@/types/admin";

const PAGE_SIZE = 10;

function formatAdminBudget(job: AdminJob) {
  const range = `${formatMoney(job.budgetMin)} – ${formatMoney(job.budgetMax)}`;
  return job.budgetType === "HOURLY" ? `${range}/hr` : range;
}

export function AdminJobs() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 400);
  const [status, setStatus] = useState<JobStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<AdminJob | null>(null);

  const { data, isLoading, isError, isPlaceholderData, refetch } = useAdminJobs(
    {
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      page,
      limit: PAGE_SIZE,
    },
  );

  const jobs = data?.jobs ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilters = searchInput.trim() !== "" || status !== "ALL";

  function clearFilters() {
    setSearchInput("");
    setStatus("ALL");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Jobs</h1>
        <p className="text-text-secondary mt-1">
          {isLoading
            ? "Loading jobs..."
            : `${total} job${total === 1 ? "" : "s"}. Cancel or close an open job that shouldn't be live.`}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-text-secondary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by job title..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as JobStatus | "ALL");
            setPage(1);
          }}
          className="sm:w-48"
          aria-label="Filter jobs by status"
        >
          <option value="ALL">All statuses</option>
          {Object.entries(jobStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError && !data ? (
        <div className="border-border bg-surface rounded-md border px-6 py-12 text-center">
          <p className="text-text-primary font-medium">
            We couldn&apos;t load jobs.
          </p>
          <Button className="mt-5" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="border-border rounded-card flex flex-col items-center justify-center gap-3 border border-dashed py-16 text-center">
          <SearchX className="text-text-secondary h-8 w-8" />
          <p className="text-text-primary text-sm font-medium">
            No jobs match your search
          </p>
          {hasFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear search and filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <Card
            className={cn(
              "overflow-hidden p-0",
              isPlaceholderData && "opacity-60 transition-opacity",
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-4xl text-left text-sm">
                <thead>
                  <tr className="border-border text-text-secondary border-b text-xs">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Job
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Client
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Budget
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Applicants
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Posted
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const clientName =
                      job.client.companyName || job.client.name;

                    return (
                      <tr
                        key={job.id}
                        className="border-border border-b last:border-0"
                      >
                        <td className="max-w-xs px-4 py-3">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-text-primary hover:text-brand-600 block truncate font-medium"
                          >
                            {job.title}
                          </Link>
                          {job.category && (
                            <Badge variant="neutral" className="mt-1">
                              {jobCategoryLabels[job.category]}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={clientName}
                              imageUrl={job.client.imageUrl}
                              size="sm"
                              accent="client"
                            />
                            {job.client.id ? (
                              <Link
                                href={`/clients/${job.client.id}`}
                                className="text-text-secondary hover:text-text-primary max-w-40 truncate hover:underline"
                              >
                                {clientName}
                              </Link>
                            ) : (
                              <span className="text-text-secondary max-w-40 truncate">
                                {clientName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-text-secondary px-4 py-3 whitespace-nowrap">
                          {formatAdminBudget(job)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {job.applicantCount}
                        </td>
                        <td className="px-4 py-3">
                          <JobStatusBadge status={job.status} />
                        </td>
                        <td className="text-text-secondary px-4 py-3 whitespace-nowrap">
                          {formatContractDate(job.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {job.status === "OPEN" ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setTarget(job)}
                            >
                              Moderate
                            </Button>
                          ) : (
                            <span className="text-text-secondary text-xs">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <JobModerationDialog job={target} onClose={() => setTarget(null)} />
    </div>
  );
}
