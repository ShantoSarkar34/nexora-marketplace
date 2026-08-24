"use client";

import Link from "next/link";
import { Briefcase, Eye, PenSquare, Plus, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { formatBudget, timeAgo } from "@/features/jobs/utils";
import { mockJobs } from "@/lib/mock-data/jobs";

export default function MyJobsPage() {
  // Track B: replace with GET /jobs?clientId=me
  const myJobs = mockJobs.filter((j) => j.clientId === "client-1");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Jobs</h1>
          <p className="mt-1 text-text-secondary">
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

      {myJobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No jobs posted yet"
          description="Post your first job to start receiving applications."
          actionLabel="Post a job"
          actionHref="/client/jobs/create"
        />
      ) : (
        <div className="space-y-4">
          {myJobs.map((job) => (
            <Card key={job.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-text-primary">
                      {job.title}
                    </h3>
                    <JobStatusBadge status={job.status} />
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    Posted {timeAgo(job.postedAt)} · {formatBudget(job)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/client/jobs/${job.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <PenSquare className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-sm text-text-secondary">
                <Users className="h-4 w-4" />
                {job.applicantCount} applicants
                <Link
                  href={`/client/applications?jobId=${job.id}`}
                  className="ml-auto font-medium text-brand-600"
                >
                  View applications →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}