"use client";

import { useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Search, SearchX } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { JobCard } from "@/features/jobs/components/job-card";
import {
  JobFilters,
  defaultJobFilters,
  type JobFiltersState,
} from "@/features/jobs/components/job-filters";
import { Pagination } from "@/components/shared/pagination";
import { useJobs } from "@/hooks/use-jobs";
import type { JobListParams } from "@/types/job";

const PAGE_SIZE = 6;

export function JobListing() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 400);
  const [filters, setFilters] = useState<JobFiltersState>(defaultJobFilters);
  const [sortBy, setSortBy] = useState<JobListParams["sortBy"]>("newest");
  const [page, setPage] = useState(1);

  const params: JobListParams = {
    search: search || undefined,
    category: filters.category === "ALL" ? undefined : filters.category,
    experienceLevel:
      filters.experienceLevel === "ALL" ? undefined : filters.experienceLevel,
    minBudget: filters.minBudget ? Number(filters.minBudget) : undefined,
    sortBy,
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isPlaceholderData } = useJobs(params);
  const jobs = data?.jobs ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const total = data?.meta?.total ?? 0;

  function handleFilterChange(next: JobFiltersState) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1>Browse Jobs</h1>
        <p className="text-text-secondary mt-1">
          {total} open jobs matching your search
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-text-secondary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by title or skill..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as JobListParams["sortBy"])}
          className="sm:w-56"
        >
          <option value="newest">Newest first</option>
          <option value="budget_desc">Budget: High to low</option>
          <option value="budget_asc">Budget: Low to high</option>
        </Select>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <JobFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={() => {
              setFilters(defaultJobFilters);
              setPage(1);
            }}
          />
        </div>

        <div className="space-y-4 lg:col-span-3">
          {isLoading && !isPlaceholderData ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-card border-border flex flex-col items-center justify-center gap-3 border border-dashed py-16 text-center">
              <SearchX className="text-text-secondary h-8 w-8" />
              <div>
                <p className="text-text-primary text-sm font-medium">
                  No jobs match your filters
                </p>
                <p className="text-text-secondary mt-1 text-sm">
                  Try adjusting your search or filters.
                </p>
              </div>
            </div>
          ) : (
            <>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              <div className="pt-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
