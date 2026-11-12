"use client";

import Link from "next/link";
import { Bell, Bookmark, Briefcase, FileText, Wallet } from "lucide-react";

import {
  ActionNeededCard,
  type ActionItem,
} from "@/components/dashboard/action-needed-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatCardSkeleton } from "@/components/dashboard/stat-card-skeleton";
import { StatsLoadError } from "@/components/dashboard/stats-load-error";
import { StatusBreakdownCard } from "@/components/dashboard/status-breakdown-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { countOf, pluralize } from "@/features/dashboard/utils";
import { formatMoney } from "@/features/payments/utils";
import { useMyApplications } from "@/hooks/use-applications";
import { useAuth } from "@/hooks/use-auth";
import { useFreelancerDashboardStats } from "@/hooks/use-dashboard";
import { useMyInvitations } from "@/hooks/use-invitations";
import { useMessagesUnreadCount } from "@/hooks/use-messaging";
import { applicationStatusLabels, type ApplicationStatus } from "@/types/enums";

export default function FreelancerDashboardPage() {
  const { user } = useAuth();
  const stats = useFreelancerDashboardStats();
  const applications = useMyApplications({ limit: 5 });
  // Only the total is needed, so ask for a single row.
  const invitations = useMyInvitations({ status: "PENDING", limit: 1 });
  const { data: unreadMessages = 0 } = useMessagesUnreadCount();

  if (!user) return null;

  const data = stats.data;
  const recentApplications = applications.data?.applications ?? [];
  const pendingInvitations = invitations.data?.meta?.total ?? 0;

  const activeContracts = countOf(data?.contracts, "ACTIVE");
  const submittedContracts = countOf(data?.contracts, "SUBMITTED");
  const pendingContracts = countOf(data?.contracts, "PENDING");
  const shortlisted = countOf(data?.applications, "SHORTLISTED");

  const actionItems: ActionItem[] = [
    {
      id: "invitations",
      count: pendingInvitations,
      text: pluralize(pendingInvitations, "pending invitation"),
      href: "/freelancer/invitations",
    },
    {
      id: "messages",
      count: unreadMessages,
      text: pluralize(unreadMessages, "unread message"),
      href: "/freelancer/messages",
    },
    {
      id: "active",
      count: activeContracts,
      text: `${pluralize(activeContracts, "contract")} in progress`,
      href: "/freelancer/contracts",
    },
    {
      id: "submitted",
      count: submittedContracts,
      text: `${pluralize(submittedContracts, "contract")} awaiting client review`,
      href: "/freelancer/contracts",
    },
    {
      id: "pending",
      count: pendingContracts,
      text: `${pluralize(pendingContracts, "contract")} awaiting payment`,
      href: "/freelancer/contracts",
    },
    {
      id: "shortlisted",
      count: shortlisted,
      text: `${pluralize(shortlisted, "application")} shortlisted`,
      href: "/freelancer/applications",
    },
  ];

  const applicationRows = (
    Object.keys(applicationStatusLabels) as ApplicationStatus[]
  ).map((status) => ({
    key: status,
    label: applicationStatusLabels[status],
    count: countOf(data?.applications, status),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-text-secondary mt-1">
          Here&apos;s what&apos;s happening with your freelance work.
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
            label="Applications sent"
            value={data.applications.total}
            icon={<FileText className="h-5 w-5" />}
            accent="freelancer"
          />
          <StatCard
            label="Active contracts"
            value={activeContracts}
            icon={<Briefcase className="h-5 w-5" />}
            accent="freelancer"
          />
          <StatCard
            label="Saved jobs"
            value={data.savedJobs}
            icon={<Bookmark className="h-5 w-5" />}
            accent="freelancer"
          />
          <StatCard
            label="Unread notifications"
            value={data.unreadNotifications}
            icon={<Bell className="h-5 w-5" />}
            accent="freelancer"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ActionNeededCard items={actionItems} isLoading={stats.isLoading} />

          <Card>
            <div className="flex items-center justify-between gap-3">
              <h3>Recent applications</h3>
              {recentApplications.length > 0 && (
                <Link
                  href="/freelancer/applications"
                  className="text-sm font-medium"
                >
                  View all
                </Link>
              )}
            </div>
            <div className="mt-4">
              {applications.isLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : recentApplications.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-6 w-6" />}
                  title="No applications yet"
                  description="Jobs you apply to will show up here so you can track their status."
                  actionLabel="Browse jobs"
                  actionHref="/freelancer/jobs"
                />
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((application) => (
                    <Link
                      key={application.id}
                      href={`/freelancer/applications/${application.id}`}
                      className="border-border hover:bg-surface-muted flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-text-primary truncate text-sm font-medium">
                          {application.jobTitle}
                        </p>
                        <p className="text-text-secondary text-xs">
                          {application.clientName}
                        </p>
                      </div>
                      <ApplicationStatusBadge status={application.status} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {stats.isLoading ? (
            <StatCardSkeleton />
          ) : data && !data.profile.hasProfile ? (
            <Card>
              <h3>Set up your profile</h3>
              <p className="text-text-secondary mt-2 text-sm">
                Clients can&apos;t find or evaluate you until you add your
                title, bio, and rate.
              </p>
              <Link href="/freelancer/profile" className="mt-4 block">
                <Button className="w-full">Create profile</Button>
              </Link>
            </Card>
          ) : data ? (
            <ProfileCompletionCard
              percentage={data.profile.completionPercentage}
            />
          ) : null}

          {data && (
            <Card>
              <div className="flex items-center justify-between">
                <h3>Earnings</h3>
                <Wallet className="text-text-secondary h-4 w-4" />
              </div>
              <p className="text-text-primary mt-3 text-2xl font-semibold">
                {formatMoney(data.earnings.totalEarned)}
              </p>
              <p className="text-text-secondary text-xs">
                earned from completed contracts
              </p>
              <div className="border-border mt-3 flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-text-secondary">In escrow</span>
                <span className="text-text-primary font-medium tabular-nums">
                  {formatMoney(data.earnings.inEscrow)}
                </span>
              </div>
              <Link
                href="/freelancer/earnings"
                className="mt-3 block text-sm font-medium"
              >
                View earnings →
              </Link>
            </Card>
          )}

          {data && (
            <StatusBreakdownCard
              title="Applications by status"
              total={data.applications.total}
              rows={applicationRows}
              footerHref="/freelancer/applications"
              footerLabel="View applications →"
            />
          )}
        </div>
      </div>
    </div>
  );
}
