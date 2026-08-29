"use client";

import { useParams, notFound } from "next/navigation";
import { Briefcase, Bookmark, Clock, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { experienceLevelLabels } from "@/types/enums";
import { useJob, useSaveJob, useUnsaveJob } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import {
  formatBudget,
  timeAgo,
  categoryLabel,
  budgetTypeLabel,
  getJobSkillNames,
} from "@/features/jobs/utils";
import { AIMatchCard } from "@/features/ai-match/components/ai-match-card";
import { ApplyJobDialog } from "@/features/applications/components/apply-job-dialog";
import { useState } from "react";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading, isError } = useJob(params.id);
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();
  const [applyOpen, setApplyOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (isError || !job) notFound();

  const isFreelancer = isAuthenticated && user?.role === "FREELANCER";
  const isPending = saveJob.isPending || unsaveJob.isPending;

  async function toggleSave() {
    if (!isFreelancer) {
      toast.info("Log in as a freelancer to save jobs.");
      return;
    }
    try {
      if (job!.isSaved) {
        await unsaveJob.mutateAsync(job!.id);
      } else {
        await saveJob.mutateAsync(job!.id);
      }
    } catch {
      // toasted globally
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={job.status === "OPEN" ? "success" : "neutral"}>
                {job.status}
              </Badge>
              <span className="text-text-secondary text-xs">
                Posted {timeAgo(job.createdAt)}
              </span>
            </div>
            <h1 className="mt-2">{job.title}</h1>
            <p className="text-text-secondary mt-1 text-sm">
              {job.clientName} · {categoryLabel(job)}
            </p>
          </div>

          <Card>
            <h3>Description</h3>
            <p className="text-text-secondary mt-3 text-sm whitespace-pre-line">
              {job.description}
            </p>
          </Card>

          <Card>
            <h3>Skills required</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {getJobSkillNames(job).map((name) => (
                <Badge key={name} variant="brand">
                  {name}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">Budget</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {formatBudget(job)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">
                    Experience level
                  </p>
                  <p className="text-text-primary text-sm font-semibold">
                    {experienceLevelLabels[job.experienceLevel]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">Applicants</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {job.applicantCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">Budget type</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {budgetTypeLabel(job)}
                  </p>
                </div>
              </div>
            </div>

            {job.status === "OPEN" && (
              <>
                {isFreelancer ? (
                  <Button
                    className="mt-6 w-full"
                    onClick={() => setApplyOpen(true)}
                  >
                    Apply Now
                  </Button>
                ) : !isAuthenticated ? (
                  <Button
                    className="mt-6 w-full"
                    onClick={() =>
                      toast.info("Log in as a freelancer to apply.")
                    }
                  >
                    Apply Now
                  </Button>
                ) : null}
                {isFreelancer && (
                  <Button
                    variant="secondary"
                    className="mt-2 w-full"
                    onClick={toggleSave}
                    isLoading={isPending}
                  >
                    <Bookmark
                      className={cn(
                        "mr-1.5 h-4 w-4",
                        job.isSaved && "fill-current",
                      )}
                    />
                    {job.isSaved ? "Saved" : "Save Job"}
                  </Button>
                )}
              </>
            )}
          </Card>

          {isFreelancer && job.status === "OPEN" && (
            <AIMatchCard jobId={job.id} />
          )}
        </div>
      </div>

      {isFreelancer && (
        <ApplyJobDialog
          job={job}
          open={applyOpen}
          onOpenChange={setApplyOpen}
        />
      )}
    </div>
  );
}
