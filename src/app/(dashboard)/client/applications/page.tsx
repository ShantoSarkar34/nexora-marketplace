"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { getInitials } from "@/lib/get-initials";
import { useMyJobs } from "@/hooks/use-jobs";
import { useJobApplicants } from "@/hooks/use-applications";

function ClientApplicationsContent() {
  const searchParams = useSearchParams();
  const { data: jobsData, isLoading: jobsLoading } = useMyJobs({ limit: 50 });
  const publishedJobs = (jobsData?.jobs ?? []).filter(
    (j) => j.status !== "DRAFT",
  );

  const [selectedJobId, setSelectedJobId] = useState(
    searchParams.get("jobId") || publishedJobs[0]?.id || "",
  );

  const { data: applicants, isLoading: applicantsLoading } =
    useJobApplicants(selectedJobId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Applications</h1>
          <p className="text-text-secondary mt-1">
            Review applicants for a specific job.
          </p>
        </div>
        {publishedJobs.length > 0 && (
          <Select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-64"
          >
            {publishedJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </Select>
        )}
      </div>

      {jobsLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : publishedJobs.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No published jobs yet"
          description="Publish a job to start receiving applications."
          actionLabel="View my jobs"
          actionHref="/client/jobs"
        />
      ) : applicantsLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !applicants || applicants.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No applications yet"
          description="Applications to this job will appear here."
        />
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <Link key={app.id} href={`/client/applications/${app.id}`}>
              <Card className="hover:border-brand-300 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-100 text-brand-700 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                      {getInitials(app.freelancerName)}
                    </span>
                    <div>
                      <p className="text-text-primary text-sm font-semibold">
                        {app.freelancerName}
                      </p>
                      <p className="text-text-secondary text-xs">
                        Proposed ${app.proposedBudget}
                      </p>
                    </div>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <ClientApplicationsContent />
    </Suspense>
  );
}
