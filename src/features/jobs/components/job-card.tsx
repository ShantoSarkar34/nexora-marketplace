"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPoster } from "@/features/jobs/components/job-poster";
import { MatchBadge } from "@/features/jobs/components/match-badge";
import { cn } from "@/lib/utils";
import { experienceLevelLabels } from "@/types/enums";
import {
  formatBudget,
  timeAgo,
  categoryLabel,
  getJobSkillNames,
} from "@/features/jobs/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSaveJob, useUnsaveJob } from "@/hooks/use-jobs";
import type { Job, JobMatch } from "@/types/job";

interface JobCardProps {
  job: Job;
  match?: JobMatch;
}

export function JobCard({ job, match }: JobCardProps) {
  const { isAuthenticated, user } = useAuth();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const canSave = isAuthenticated && user?.role === "FREELANCER";
  const isPending = saveJob.isPending || unsaveJob.isPending;
  const skillNames = getJobSkillNames(job);

  const matchedNames = new Set(
    (match?.matchedSkills ?? []).map((name) => name.toLowerCase()),
  );
  const isMatched = (name: string) => matchedNames.has(name.toLowerCase());

  // Matched skills first, otherwise the original order.
  const orderedSkills = match
    ? [...skillNames].sort(
        (a, b) => Number(isMatched(b)) - Number(isMatched(a)),
      )
    : skillNames;
  const matchedCount = skillNames.filter(isMatched).length;

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!canSave) {
      toast.info("Log in as a freelancer to save jobs.");
      return;
    }
    try {
      if (job.isSaved) {
        await unsaveJob.mutateAsync(job.id);
      } else {
        await saveJob.mutateAsync(job.id);
      }
    } catch {
      // toasted globally
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:border-brand-300 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link href={`/jobs/${job.id}`}>
              <h3 className="text-text-primary hover:text-brand-600 text-base font-semibold">
                {job.title}
              </h3>
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <JobPoster job={job} compact />
              <span className="text-text-secondary text-xs">
                · {timeAgo(job.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {match && <MatchBadge score={match.score} />}
            <button
              onClick={toggleSave}
              disabled={isPending}
              aria-label={job.isSaved ? "Unsave job" : "Save job"}
              className="text-text-secondary hover:text-brand-600 disabled:opacity-50"
            >
              <Bookmark
                className={cn(
                  "h-5 w-5",
                  job.isSaved && "fill-brand-600 text-brand-600",
                )}
              />
            </button>
          </div>
        </div>

        <p className="text-text-secondary mt-3 line-clamp-2 text-sm">
          {job.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {orderedSkills.slice(0, 4).map((name) => (
            <Badge
              key={name}
              variant={match && isMatched(name) ? "success" : "neutral"}
            >
              {name}
            </Badge>
          ))}
        </div>

        {match && skillNames.length > 0 && (
          <p className="text-text-secondary mt-2 text-xs">
            {matchedCount} of {skillNames.length} required skills match
          </p>
        )}

        <div className="border-border text-text-secondary mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-text-primary font-semibold">
              {formatBudget(job)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {job.applicantCount} applicants
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {experienceLevelLabels[job.experienceLevel]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {job.hasApplied && <Badge variant="success">Applied</Badge>}
            <Badge variant="neutral">{categoryLabel(job)}</Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
