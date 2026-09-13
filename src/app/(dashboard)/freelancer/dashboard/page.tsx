"use client";

import { Bell, Briefcase, Bookmark, FileText } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { useFreelancerProfile } from "@/hooks/use-freelancer-profile";
import { useMyApplications } from "@/hooks/use-applications";
import { useMyContracts } from "@/hooks/use-contracts";
import { useSavedJobs } from "@/hooks/use-jobs";
import { useUnreadCount } from "@/hooks/use-notifications";
import Link from "next/link";

export default function FreelancerDashboardPage() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useFreelancerProfile();
  const { data: applicationsData, isLoading: applicationsLoading } =
    useMyApplications({ limit: 5 });
  const { data: contracts } = useMyContracts();
  const { data: savedJobsData } = useSavedJobs({ limit: 1 });
  const { data: unreadCount = 0 } = useUnreadCount(!!user);

  if (!user) return null;

  const totalApplications = applicationsData?.meta?.total ?? 0;
  const activeContracts = (contracts ?? []).filter(
    (c) => c.status === "ACTIVE",
  ).length;
  const totalSavedJobs = savedJobsData?.meta?.total ?? 0;
  const recentApplications = applicationsData?.applications ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-text-secondary mt-1">
          Here&apos;s what&apos;s happening with your freelance work.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Applications sent"
          value={totalApplications}
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
          value={totalSavedJobs}
          icon={<Bookmark className="h-5 w-5" />}
          accent="freelancer"
        />
        <StatCard
          label="Unread notifications"
          value={unreadCount}
          icon={<Bell className="h-5 w-5" />}
          accent="freelancer"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3>Recent applications</h3>
            <div className="mt-4">
              {applicationsLoading ? (
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
                  {recentApplications.map((app) => (
                    <Link
                      key={app.id}
                      href={`/freelancer/applications/${app.id}`}
                      className="border-border hover:bg-surface-muted flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="text-text-primary text-sm font-medium">
                          {app.jobTitle}
                        </p>
                        <p className="text-text-secondary text-xs">
                          {app.clientName}
                        </p>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {profileLoading ? (
            <Card className="flex justify-center py-6">
              <Spinner className="h-6 w-6" />
            </Card>
          ) : profile ? (
            <ProfileCompletionCard percentage={profile.completionPercentage} />
          ) : (
            <Card>
              <p className="text-text-secondary text-sm">
                Set up your profile to see your completion status.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
