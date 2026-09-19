"use client";

import Link from "next/link";
import {
  AlertCircle,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSignature,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { useAuth } from "@/hooks/use-auth";
import { useMyJobs } from "@/hooks/use-jobs";
import { useMyContracts } from "@/hooks/use-contracts";
import { useMyPayments } from "@/hooks/use-payments";
import { useUnreadCount } from "@/hooks/use-notifications";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const { data: jobsData, isLoading: jobsLoading } = useMyJobs({ limit: 50 });
  const { data: contracts } = useMyContracts();
  const { data: paymentsData } = useMyPayments({
    status: "SUCCESS",
    limit: 100,
  });
  const { data: unreadCount = 0 } = useUnreadCount(!!user);

  if (!user) return null;

  const jobs = jobsData?.jobs ?? [];
  const activeJobs = jobs.filter(
    (j) => j.status === "OPEN" || j.status === "IN_PROGRESS",
  ).length;
  const draftJobs = jobs.filter((j) => j.status === "DRAFT");
  const stalledJobs = jobs.filter(
    (j) => j.status === "OPEN" && (j.applicantCount ?? 0) === 0,
  );

  const pendingContracts = (contracts ?? []).filter(
    (c) => c.status === "PENDING",
  ).length;
  const activeContracts = (contracts ?? []).filter(
    (c) => c.status === "ACTIVE",
  ).length;
  const completedContracts = (contracts ?? []).filter(
    (c) => c.status === "COMPLETED",
  ).length;

  const totalSpent = (paymentsData?.payments ?? []).reduce(
    (sum, p) => sum + p.amount,
    0,
  );

  const needsAttention = [...draftJobs, ...stalledJobs];

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
          label="Pending payment"
          value={pendingContracts}
          icon={<Clock className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Active contracts"
          value={activeContracts}
          icon={<FileSignature className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Total spent"
          value={totalSpent}
          prefix="$"
          icon={<DollarSign className="h-5 w-5" />}
          accent="client"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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
                  {jobs.slice(0, 5).map((job) => (
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

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-status-active h-4 w-4" />
              <h3>Completed</h3>
            </div>
            <p className="text-text-primary mt-2 text-2xl font-semibold">
              {completedContracts}
            </p>
            <p className="text-text-secondary text-xs">contracts finished</p>
          </Card>

          {needsAttention.length > 0 && (
            <Card className="border-status-pending/30 bg-status-pending/5">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-status-pending h-4 w-4" />
                <h3>Needs attention</h3>
              </div>
              <div className="mt-3 space-y-2">
                {draftJobs.length > 0 && (
                  <Link
                    href="/client/jobs"
                    className="text-text-secondary hover:text-text-primary block text-sm"
                  >
                    {draftJobs.length} unpublished draft
                    {draftJobs.length > 1 ? "s" : ""} — ready to post?
                  </Link>
                )}
                {stalledJobs.length > 0 && (
                  <Link
                    href="/client/jobs"
                    className="text-text-secondary hover:text-text-primary block text-sm"
                  >
                    {stalledJobs.length} open job
                    {stalledJobs.length > 1 ? "s" : ""} with no applicants yet
                  </Link>
                )}
              </div>
            </Card>
          )}

          <Card>
            <div className="flex items-center gap-2">
              <Bell className="text-text-secondary h-4 w-4" />
              <h3>Notifications</h3>
            </div>
            <p className="text-text-primary mt-2 text-2xl font-semibold">
              {unreadCount}
            </p>
            <p className="text-text-secondary text-xs">unread</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
