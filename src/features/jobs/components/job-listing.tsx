"use client";

import { useMemo, useState } from "react";
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
import { mockJobs } from "@/lib/mock-data/jobs";

const PAGE_SIZE = 5;
type SortOption = "newest" | "budget-high" | "budget-low";

export function JobListing() {
  // Track B: replace local state + filtering with TanStack Query fetching
  // GET /jobs?search=&category=&experienceLevel=&minBudget=&sort=&page=
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<JobFiltersState>(defaultJobFilters);
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false); // wired to real query loading in Track B

  const filteredJobs = useMemo(() => {
    let jobs = mockJobs.filter((job) => job.status === "OPEN");

    if (search.trim()) {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (filters.category !== "ALL") {
      jobs = jobs.filter((job) => job.category === filters.category);
    }
    if (filters.experienceLevel !== "ALL") {
      jobs = jobs.filter((job) => job.experienceLevel === filters.experienceLevel);
    }
    if (filters.minBudget) {
      const min = Number(filters.minBudget);
      jobs = jobs.filter((job) => job.budgetMax >= min);
    }

    jobs = [...jobs].sort((a, b) => {
      if (sort === "budget-high") return b.budgetMax - a.budgetMax;
      if (sort === "budget-low") return a.budgetMax - b.budgetMax;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });

    return jobs;
  }, [search, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function handleFilterChange(next: JobFiltersState) {
    setFilters(next);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1>Browse Jobs</h1>
        <p className="mt-1 text-text-secondary">
          {filteredJobs.length} open jobs matching your search
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            placeholder="Search by title or skill..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="sm:w-56"
        >
          <option value="newest">Newest first</option>
          <option value="budget-high">Budget: High to low</option>
          <option value="budget-low">Budget: Low to high</option>
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
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : paginatedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border py-16 text-center">
              <SearchX className="h-8 w-8 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  No jobs match your filters
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Try adjusting your search or filters.
                </p>
              </div>
            </div>
          ) : (
            <>
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              <div className="pt-4">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}