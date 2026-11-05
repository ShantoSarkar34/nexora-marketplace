"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  availabilityLabels,
  experienceLevelLabels,
  type Availability,
  type ExperienceLevel,
} from "@/types/enums";

export interface TalentFiltersState {
  availability: Availability | "ALL";
  experienceLevel: ExperienceLevel | "ALL";
  minRate: string;
  maxRate: string;
  minRating: string;
  skills: string[];
}

export const defaultTalentFilters: TalentFiltersState = {
  availability: "ALL",
  experienceLevel: "ALL",
  minRate: "",
  maxRate: "",
  minRating: "",
  skills: [],
};

export function countActiveFilters(filters: TalentFiltersState): number {
  let count = filters.skills.length;
  if (filters.availability !== "ALL") count += 1;
  if (filters.experienceLevel !== "ALL") count += 1;
  if (filters.minRate) count += 1;
  if (filters.maxRate) count += 1;
  if (filters.minRating) count += 1;
  return count;
}

interface TalentFiltersProps {
  filters: TalentFiltersState;
  onChange: (filters: TalentFiltersState) => void;
  onReset: () => void;
  rateRangeInvalid: boolean;
}

export function TalentFilters({
  filters,
  onChange,
  onReset,
  rateRangeInvalid,
}: TalentFiltersProps) {
  const [skillDraft, setSkillDraft] = useState("");

  function addSkills() {
    // Allow "React, Node.js" in one go.
    const incoming = skillDraft
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    if (incoming.length === 0) return;

    const next = [...filters.skills];
    for (const name of incoming) {
      if (
        !next.some((existing) => existing.toLowerCase() === name.toLowerCase())
      ) {
        next.push(name);
      }
    }
    onChange({ ...filters, skills: next });
    setSkillDraft("");
  }

  function removeSkill(name: string) {
    onChange({
      ...filters,
      skills: filters.skills.filter((existing) => existing !== name),
    });
  }

  return (
    <div className="border-border bg-surface rounded-card space-y-5 border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary text-sm font-semibold">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-brand-600 text-xs font-medium hover:underline"
        >
          Reset
        </button>
      </div>

      <div>
        <Label htmlFor="talent-skills">Skills (matches any)</Label>
        <div className="flex gap-2">
          <Input
            id="talent-skills"
            placeholder="e.g. React"
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkills();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={addSkills}
          >
            Add
          </Button>
        </div>
        {filters.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {filters.skills.map((name) => (
              <Badge key={name} variant="brand" className="gap-1.5 pr-1.5">
                {name}
                <button
                  type="button"
                  onClick={() => removeSkill(name)}
                  aria-label={`Remove ${name}`}
                  className="hover:bg-brand-100 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="talent-availability">Availability</Label>
        <Select
          id="talent-availability"
          value={filters.availability}
          onChange={(e) =>
            onChange({
              ...filters,
              availability: e.target
                .value as TalentFiltersState["availability"],
            })
          }
        >
          <option value="ALL">Any availability</option>
          {Object.entries(availabilityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="talent-experience">Experience level</Label>
        <Select
          id="talent-experience"
          value={filters.experienceLevel}
          onChange={(e) =>
            onChange({
              ...filters,
              experienceLevel: e.target
                .value as TalentFiltersState["experienceLevel"],
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
        <Label>Hourly rate ($)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            aria-label="Minimum hourly rate"
            value={filters.minRate}
            onChange={(e) => onChange({ ...filters, minRate: e.target.value })}
          />
          <span className="text-text-secondary text-sm">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            aria-label="Maximum hourly rate"
            value={filters.maxRate}
            onChange={(e) => onChange({ ...filters, maxRate: e.target.value })}
          />
        </div>
        {rateRangeInvalid && (
          <p className="text-status-pending mt-1 text-xs">
            The minimum is higher than the maximum, so the rate filter is
            paused.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="talent-rating">Minimum rating</Label>
        <Select
          id="talent-rating"
          value={filters.minRating}
          onChange={(e) => onChange({ ...filters, minRating: e.target.value })}
        >
          <option value="">Any rating</option>
          <option value="3">3.0 and up</option>
          <option value="4">4.0 and up</option>
          <option value="4.5">4.5 and up</option>
        </Select>
      </div>
    </div>
  );
}
