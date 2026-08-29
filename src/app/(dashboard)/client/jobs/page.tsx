"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  Eye,
  PenSquare,
  Plus,
  Rocket,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { formatBudget, timeAgo } from "@/features/jobs/utils";
import { useDeleteJob, useMyJobs, useUpdateJobStatus } from "@/hooks/use-jobs";

const PAGE_SIZE = 10;

export default function MyJobsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyJobs({ page, limit: PAGE_SIZE });
  const updateStatus = useUpdateJobStatus();
  const deleteJob = useDeleteJob();

  const jobs = data?.jobs ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  async function publish(jobId: string) {
    try {
      await updateStatus.mutateAsync({ jobId, status: "OPEN" });
      toast.success("Job published — it's now visible to freelancers.");
    } catch {
      // toasted globally
    }
  }

  async function cancel(jobId: string) {
    try {
      await updateStatus.mutateAsync({ jobId, status: "CANCELLED" });
      toast.success("Job cancelled.");
    } catch {
      // toasted globally
    }
  }

  async function remove(jobId: string) {
    try {
      await deleteJob.mutateAsync(jobId);
      toast.success("Draft deleted.");
    } catch {
      // toasted globally (e.g. 400 if it's not actually a draft)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Jobs</h1>
          <p className="text-text-secondary mt-1">
            Manage your posted jobs and applications.
          </p>
        </div>
        <Link href="/client/jobs/create">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No jobs posted yet"
          description="Post your first job to start receiving applications."
          actionLabel="Post a job"
          actionHref="/client/jobs/create"
        />
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-text-primary text-base font-semibold">
                        {job.title}
                      </h3>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <p className="text-text-secondary mt-1 text-xs">
                      Posted {timeAgo(job.createdAt)} · {formatBudget(job)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {job.status === "OPEN" && (
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                    )}
                    {(job.status === "DRAFT" || job.status === "OPEN") && (
                      <Link href={`/client/jobs/${job.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <PenSquare className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                    )}
                    {job.status === "DRAFT" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => publish(job.id)}
                          isLoading={updateStatus.isPending}
                        >
                          <Rocket className="mr-1.5 h-3.5 w-3.5" />
                          Publish
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(job.id)}
                          isLoading={deleteJob.isPending}
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </>
                    )}
                    {job.status === "OPEN" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancel(job.id)}
                        isLoading={updateStatus.isPending}
                      >
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
                {job.status !== "DRAFT" && (
                  <div className="border-border text-text-secondary mt-4 flex items-center gap-2 border-t pt-3 text-sm">
                    <Users className="h-4 w-4" />
                    {job.applicantCount} applicants
                    <Link
                      href={`/client/applications?jobId=${job.id}`}
                      className="text-brand-600 ml-auto font-medium"
                    >
                      View applications →
                    </Link>
                  </div>
                )}
              </Card>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
