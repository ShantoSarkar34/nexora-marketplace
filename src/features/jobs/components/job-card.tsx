"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatBudget, timeAgo } from "@/features/jobs/utils";
import type { Job } from "@/types/job";

export function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

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
              {job.clientName} · {timeAgo(job.postedAt)}
            </p>
          </div>
          <button
            onClick={() => setSaved((v) => !v)}
            aria-label={saved ? "Unsave job" : "Save job"}
            className="text-text-secondary hover:text-brand-600 shrink-0"
          >
            <Bookmark
              className={cn(
                "h-5 w-5",
                saved && "fill-brand-600 text-brand-600",
              )}
            />
          </button>
        </div>

        <p className="text-text-secondary mt-3 line-clamp-2 text-sm">
          {job.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="neutral">
              {skill}
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
              {job.experienceLevel}
            </span>
          </div>
          <Badge variant={job.status === "OPEN" ? "success" : "neutral"}>
            {job.status}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}
