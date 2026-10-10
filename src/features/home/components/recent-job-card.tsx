"use client";

import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatBudget,
  timeAgo,
  categoryLabel,
  getJobSkillNames,
} from "@/features/jobs/utils";
import { experienceLevelLabels } from "@/types/enums";
import type { Job } from "@/types/job";

export function RecentJobCard({ job }: { job: Job }) {
  const skillNames = getJobSkillNames(job);

  return (
    <article className="group border-border bg-surface hover:border-brand-500/40 rounded-xl border p-5 transition-all duration-200 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Job information */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{categoryLabel(job)}</Badge>

            <span className="text-text-secondary inline-flex items-center gap-1.5 text-xs">
              <Clock3 className="h-3.5 w-3.5" />
              {timeAgo(job.createdAt)}
            </span>
          </div>

          <Link href={`/jobs/${job.id}`} className="inline-block">
            <h3 className="text-text-primary group-hover:text-brand-600 text-base font-semibold transition-colors sm:text-lg">
              {job.title}
            </h3>
          </Link>

          <p className="text-text-secondary mt-1.5 text-sm">
            Posted by {job.clientName}
          </p>

          <p className="text-text-secondary mt-3 line-clamp-2 text-sm leading-6">
            {job.description}
          </p>

          {skillNames.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skillNames.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="neutral">
                  {skill}
                </Badge>
              ))}

              {skillNames.length > 4 && (
                <span className="text-text-secondary self-center text-xs">
                  +{skillNames.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Budget and action */}
        <div className="border-border flex items-center justify-between gap-4 border-t pt-4 sm:min-w-36 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="sm:text-right">
            <p className="text-text-secondary text-xs">Budget</p>
            <p className="text-text-primary mt-1 text-base font-bold">
              {formatBudget(job)}
            </p>
          </div>

          <Link
            href={`/jobs/${job.id}`}
            className="bg-brand-600 hover:bg-brand-600/90 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            View job
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Secondary metadata */}
      <div className="border-border text-text-secondary mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <BriefcaseBusiness className="h-3.5 w-3.5" />
          {experienceLevelLabels[job.experienceLevel]}
        </span>

        <span>
          {job.applicantCount}{" "}
          {job.applicantCount === 1 ? "applicant" : "applicants"}
        </span>
      </div>
    </article>
  );
}
