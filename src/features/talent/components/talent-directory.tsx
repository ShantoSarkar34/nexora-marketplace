"use client";

import { useState } from "react";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/shared/pagination";
import { FeaturedTalentCard } from "@/features/home/components/featured-talent-card";
import {
  TalentFilters,
  countActiveFilters,
  defaultTalentFilters,
  type TalentFiltersState,
} from "@/features/talent/components/talent-filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFreelancerDirectory } from "@/hooks/use-freelancer-directory";
import { cn } from "@/lib/utils";
import type { FreelancerListParams } from "@/services/profile";

const PAGE_SIZE = 9;

type SortOption = NonNullable<FreelancerListParams["sortBy"]>;

// "" or a bad number means "no limit". Negative numbers are ignored.
function toRate(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function TalentCardSkeleton() {
  return (
    <div className="border-border bg-surface animate-pulse rounded-2xl border p-6">
      <div className="flex items-center gap-4">
        <div className="bg-surface-muted h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="bg-surface-muted h-4 w-2/3 rounded" />
          <div className="bg-surface-muted h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="bg-surface-muted mt-6 h-16 rounded" />
      <div className="mt-5 flex gap-2">
        <div className="bg-surface-muted h-7 w-16 rounded-full" />
        <div className="bg-surface-muted h-7 w-20 rounded-full" />
        <div className="bg-surface-muted h-7 w-14 rounded-full" />
      </div>
      <div className="bg-surface-muted mt-6 h-10 rounded" />
    </div>
  );
}

export function TalentDirectory() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 400);
  const [filters, setFilters] =
    useState<TalentFiltersState>(defaultTalentFilters);
  const minRateInput = useDebouncedValue(filters.minRate, 400);
  const maxRateInput = useDebouncedValue(filters.maxRate, 400);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const minRate = toRate(minRateInput);
  const maxRate = toRate(maxRateInput);
  const rateRangeInvalid =
    minRate !== undefined && maxRate !== undefined && minRate > maxRate;

  const params: FreelancerListParams = {
    search: search.trim() || undefined,
    skills: filters.skills.length > 0 ? filters.skills : undefined,
    experienceLevel:
      filters.experienceLevel === "ALL" ? undefined : filters.experienceLevel,
    availability:
      filters.availability === "ALL" ? undefined : filters.availability,
    // A reversed range would just return nothing, so pause it instead.
    minRate: rateRangeInvalid ? undefined : minRate,
    maxRate: rateRangeInvalid ? undefined : maxRate,
    minRating: filters.minRating ? Number(filters.minRating) : undefined,
    sortBy,
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useFreelancerDirectory(params);

  const freelancers = data?.freelancers ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const activeFilters = countActiveFilters(filters);
  const hasAnyFilter = activeFilters > 0 || searchInput.trim() !== "";

  function handleFiltersChange(next: TalentFiltersState) {
    setFilters(next);
    setPage(1);
  }

  function resetFilters() {
    setFilters(defaultTalentFilters);
    setPage(1);
  }

  function clearEverything() {
    setSearchInput("");
    resetFilters();
  }

  function changePage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1>Find Talent</h1>
        <p className="text-text-secondary mt-1">
          {isLoading
            ? "Searching freelancers..."
            : `${total} freelancer${total === 1 ? "" : "s"} found`}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-text-secondary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name, title, bio, or skill..."
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
          onChange={(e) => {
            setSortBy(e.target.value as SortOption);
            setPage(1);
          }}
          className="sm:w-56"
          aria-label="Sort freelancers"
        >
          <option value="rating">Top rated</option>
          <option value="newest">Newest</option>
          <option value="rate_asc">Rate: low to high</option>
          <option value="rate_desc">Rate: high to low</option>
        </Select>
        <Button
          type="button"
          variant="secondary"
          className="lg:hidden"
          onClick={() => setShowFilters((value) => !value)}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="mr-1.5 h-4 w-4" />
          Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div
          className={cn(
            showFilters ? "block" : "hidden",
            "lg:col-span-1 lg:block",
          )}
        >
          <TalentFilters
            filters={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            rateRangeInvalid={rateRangeInvalid}
          />
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <TalentCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="border-border bg-surface rounded-2xl border px-6 py-12 text-center">
              <p className="text-text-primary font-medium">
                We couldn&apos;t load freelancers right now.
              </p>
              <p className="text-text-secondary mt-2 text-sm">
                Please try again in a moment.
              </p>
              <Button className="mt-5" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : freelancers.length === 0 ? (
            <div className="border-border rounded-card flex flex-col items-center justify-center gap-3 border border-dashed py-16 text-center">
              <SearchX className="text-text-secondary h-8 w-8" />
              <div>
                <p className="text-text-primary text-sm font-medium">
                  No freelancers match your search
                </p>
                <p className="text-text-secondary mt-1 text-sm">
                  Try fewer filters or a different keyword.
                </p>
              </div>
              {hasAnyFilter && (
                <Button variant="secondary" size="sm" onClick={clearEverything}>
                  Clear search and filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
                  isPlaceholderData && "opacity-60 transition-opacity",
                )}
              >
                {freelancers.map((freelancer) => (
                  <FeaturedTalentCard
                    key={freelancer.id}
                    freelancer={freelancer}
                  />
                ))}
              </div>
              <div className="pt-8">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={changePage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
