"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { experienceLevelLabels, jobCategoryLabels } from "@/types/enums";
import type { ExperienceLevel, JobCategory } from "@/types/enums";

export interface JobFiltersState {
  category: JobCategory | "ALL";
  experienceLevel: ExperienceLevel | "ALL";
  minBudget: string;
}

interface JobFiltersProps {
  filters: JobFiltersState;
  onChange: (filters: JobFiltersState) => void;
  onReset: () => void;
}

export const defaultJobFilters: JobFiltersState = {
  category: "ALL",
  experienceLevel: "ALL",
  minBudget: "",
};

export function JobFilters({ filters, onChange, onReset }: JobFiltersProps) {
  return (
    <div className="rounded-card border-border bg-surface space-y-5 border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary text-sm font-semibold">Filters</h3>
        <button
          onClick={onReset}
          className="text-brand-600 text-xs font-medium hover:underline"
        >
          Reset
        </button>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          value={filters.category}
          onChange={(e) =>
            onChange({
              ...filters,
              category: e.target.value as JobFiltersState["category"],
            })
          }
        >
          <option value="ALL">All categories</option>
          {Object.entries(jobCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="experience">Experience level</Label>
        <Select
          id="experience"
          value={filters.experienceLevel}
          onChange={(e) =>
            onChange({
              ...filters,
              experienceLevel: e.target
                .value as JobFiltersState["experienceLevel"],
            })
          }
        >
          <option value="ALL">Any level</option>
          {Object.entries(experienceLevelLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="minBudget">Minimum budget ($)</Label>
        <Input
          id="minBudget"
          type="number"
          min={0}
          placeholder="e.g. 500"
          value={filters.minBudget}
          onChange={(e) => onChange({ ...filters, minBudget: e.target.value })}
        />
      </div>
    </div>
  );
}
