"use client";

import Link from "next/link";
import { Bell, Briefcase, FileSignature, Users, Wallet } from "lucide-react";

import {
  ActionNeededCard,
  type ActionItem,
} from "@/components/dashboard/action-needed-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatCardSkeleton } from "@/components/dashboard/stat-card-skeleton";
import { StatsLoadError } from "@/components/dashboard/stats-load-error";
import { StatusBreakdownCard } from "@/components/dashboard/status-breakdown-card";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { countOf, pluralize } from "@/features/dashboard/utils";
import { JobStatusBadge } from "@/features/jobs/components/job-status-badge";
import { formatMoney } from "@/features/payments/utils";
import { useAuth } from "@/hooks/use-auth";
import { useClientDashboardStats } from "@/hooks/use-dashboard";
import { useMyJobs } from "@/hooks/use-jobs";
import { useMessagesUnreadCount } from "@/hooks/use-messaging";
import {
  contractStatusLabels,
  jobStatusLabels,
  type ContractStatus,
  type JobStatus,
} from "@/types/enums";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const stats = useClientDashboardStats();
  // The recent-jobs list and the "no applicants yet" count need job rows,
  // which the stats endpoint doesn't include.
  const { data: jobsData, isLoading: jobsLoading } = useMyJobs({ limit: 50 });
  const { data: unreadMessages = 0 } = useMessagesUnreadCount();

  if (!user) return null;

  const data = stats.data;
  const jobs = jobsData?.jobs ?? [];
  const stalledJobs = jobs.filter(
    (job) => job.status === "OPEN" && job.applicantCount === 0,
  ).length;

  const activeJobs =
    countOf(data?.jobs, "OPEN") + countOf(data?.jobs, "IN_PROGRESS");
  const drafts = countOf(data?.jobs, "DRAFT");
  const activeContracts = countOf(data?.contracts, "ACTIVE");
  const pendingContracts = countOf(data?.contracts, "PENDING");
  const submittedContracts = countOf(data?.contracts, "SUBMITTED");

  const actionItems: ActionItem[] = [
    {
      id: "payment",
      count: pendingContracts,
      text: `${pluralize(pendingContracts, "contract")} awaiting your payment`,
      href: "/client/contracts",
    },
    {
      id: "review",
      count: submittedContracts,
      text: `${pluralize(submittedContracts, "contract")} with work to review`,
      href: "/client/contracts",
    },
    {
      id: "messages",
      count: unreadMessages,
      text: pluralize(unreadMessages, "unread message"),
      href: "/client/messages",
    },
    {
      id: "drafts",
      count: drafts,
      text: pluralize(drafts, "unpublished draft"),
      href: "/client/jobs",
    },
    {
      id: "stalled",
      count: stalledJobs,
      text: `${pluralize(stalledJobs, "open job")} with no applicants yet`,
      href: "/client/jobs",
    },
  ];

  const jobRows = (Object.keys(jobStatusLabels) as JobStatus[]).map(
    (status) => ({
      key: status,
      label: jobStatusLabels[status],
      count: countOf(data?.jobs, status),
    }),
  );

  const contractRows = (
    Object.keys(contractStatusLabels) as ContractStatus[]
  ).map((status) => ({
    key: status,
    label: contractStatusLabels[status],
    count: countOf(data?.contracts, status),
  }));

  // Round to cents so adding two decimals never shows 0.30000000000000004.
  const totalPaid = data
    ? Math.round((data.spending.totalSpent + data.spending.inEscrow) * 100) /
      100
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-text-secondary mt-1">
          Here&apos;s an overview of your jobs and hiring activity.
        </p>
      </div>

      {stats.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : stats.isError || !data ? (
        <StatsLoadError onRetry={() => stats.refetch()} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active jobs"
            value={activeJobs}
            icon={<Briefcase className="h-5 w-5" />}
            accent="client"
          />
          <StatCard
            label="Total applicants"
            value={data.totalApplicants}
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
            value={data.unreadNotifications}
            icon={<Bell className="h-5 w-5" />}
            accent="client"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ActionNeededCard
            items={actionItems}
            isLoading={stats.isLoading || jobsLoading}
          />

          <Card>
            <div className="flex items-center justify-between gap-3">
              <h3>Your recent jobs</h3>
              {jobs.length > 0 && (
                <Link href="/client/jobs" className="text-sm font-medium">
                  View all
                </Link>
              )}
            </div>
            <div className="mt-4">
              {jobsLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner className="h-6 w-6" />
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
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <Link
                      key={job.id}
                      // Drafts open in the editor; everything else on the job
                      // page, which has the owner's manage actions.
                      href={
                        job.status === "DRAFT"
                          ? `/client/jobs/${job.id}/edit`
                          : `/jobs/${job.id}`
                      }
                      className="border-border hover:bg-surface-muted flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-text-primary truncate text-sm font-medium">
                          {job.title}
                        </p>
                        <p className="text-text-secondary text-xs">
                          {pluralize(job.applicantCount, "applicant")}
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
          {data && (
            <Card>
              <div className="flex items-center justify-between">
                <h3>Spending</h3>
                <Wallet className="text-text-secondary h-4 w-4" />
              </div>
              <p className="text-text-primary mt-3 text-2xl font-semibold">
                {formatMoney(totalPaid)}
              </p>
              <p className="text-text-secondary text-xs">paid so far</p>
              <div className="border-border mt-3 space-y-2 border-t pt-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Completed work</span>
                  <span className="text-text-primary font-medium tabular-nums">
                    {formatMoney(data.spending.totalSpent)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">In escrow</span>
                  <span className="text-text-primary font-medium tabular-nums">
                    {formatMoney(data.spending.inEscrow)}
                  </span>
                </div>
              </div>
              <Link
                href="/client/payments"
                className="mt-3 block text-sm font-medium"
              >
                View payments →
              </Link>
            </Card>
          )}

          {data && (
            <StatusBreakdownCard
              title="Jobs by status"
              total={data.jobs.total}
              rows={jobRows}
              footerHref="/client/jobs"
              footerLabel="Manage jobs →"
            />
          )}

          {data && (
            <StatusBreakdownCard
              title="Contracts by status"
              total={data.contracts.total}
              rows={contractRows}
              footerHref="/client/contracts"
              footerLabel="View contracts →"
            />
          )}
        </div>
      </div>
    </div>
  );
}
