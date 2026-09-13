"use client";

import Link from "next/link";
import { Bell, Briefcase, FileSignature, Users } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { useAuth } from "@/hooks/use-auth";
import { useMyJobs } from "@/hooks/use-jobs";
import { useMyContracts } from "@/hooks/use-contracts";
import { useUnreadCount } from "@/hooks/use-notifications";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const { data: jobsData, isLoading: jobsLoading } = useMyJobs({ limit: 5 });
  const { data: contracts } = useMyContracts();
  const { data: unreadCount = 0 } = useUnreadCount(!!user);

  if (!user) return null;

  const jobs = jobsData?.jobs ?? [];
  const activeJobs = jobs.filter(
    (j) => j.status === "OPEN" || j.status === "IN_PROGRESS",
  ).length;
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applicantCount ?? 0),
    0,
  );
  const activeContracts = (contracts ?? []).filter(
    (c) => c.status === "ACTIVE",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-text-secondary mt-1">
          Here&apos;s an overview of your jobs and hiring activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active jobs"
          value={activeJobs}
          icon={<Briefcase className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Total applicants"
          value={totalApplicants}
          icon={<Users className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Active contracts"
          value={activeContracts}
          icon={<FileSignature className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Unread notifications"
          value={unreadCount}
          icon={<Bell className="h-5 w-5" />}
          accent="client"
        />
      </div>

      <Card>
        <h3>Your recent jobs</h3>
        <div className="mt-4">
          {jobsLoading ? null : jobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No jobs posted yet"
              description="Post your first job to start receiving applications."
              actionLabel="Post a job"
              actionHref="/client/jobs/create"
            />
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/client/jobs/${job.id}/edit`}
                  className="border-border hover:bg-surface-muted flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="text-text-primary text-sm font-medium">
                      {job.title}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {job.applicantCount} applicants
                    </p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
