"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import type { Job } from "@/types/job";

export function JobCard({ job }: { job: Job }) {
  const { isAuthenticated, user } = useAuth();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const canSave = isAuthenticated && user?.role === "FREELANCER";
  const isPending = saveJob.isPending || unsaveJob.isPending;
  const skillNames = getJobSkillNames(job);

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
            <p className="text-text-secondary mt-1 text-xs">
              {job.clientName} · {timeAgo(job.createdAt)}
            </p>
          </div>
          <button
            onClick={toggleSave}
            disabled={isPending}
            aria-label={job.isSaved ? "Unsave job" : "Save job"}
            className="text-text-secondary hover:text-brand-600 shrink-0 disabled:opacity-50"
          >
            <Bookmark
              className={cn(
                "h-5 w-5",
                job.isSaved && "fill-brand-600 text-brand-600",
              )}
            />
          </button>
        </div>

        <p className="text-text-secondary mt-3 line-clamp-2 text-sm">
          {job.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {skillNames.slice(0, 4).map((name) => (
            <Badge key={name} variant="neutral">
              {name}
            </Badge>
          ))}
        </div>

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
          <Badge variant="neutral">{categoryLabel(job)}</Badge>
        </div>
      </Card>
    </motion.div>
  );
}
