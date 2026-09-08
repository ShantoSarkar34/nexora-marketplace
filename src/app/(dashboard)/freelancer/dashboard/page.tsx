"use client";

import { Bell, Briefcase, Bookmark, FileText, TrendingUp } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useFreelancerProfile } from "@/hooks/use-freelancer-profile";

export default function FreelancerDashboardPage() {
  const { user } = useAuth();
  const { profile, isLoading } = useFreelancerProfile();

  if (!user) return null;

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
          value={0}
          icon={<FileText className="h-5 w-5" />}
          accent="freelancer"
        />
        <StatCard
          label="Active contracts"
          value={0}
          icon={<Briefcase className="h-5 w-5" />}
          accent="freelancer"
        />
        <StatCard
          label="Saved jobs"
          value={0}
          icon={<Bookmark className="h-5 w-5" />}
          accent="freelancer"
        />
        <StatCard
          label="Avg. match score"
          value={0}
          suffix="%"
          icon={<TrendingUp className="h-5 w-5" />}
          accent="freelancer"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3>Recent applications</h3>
            <div className="mt-4">
              <EmptyState
                icon={<FileText className="h-6 w-6" />}
                title="No applications yet"
                description="Jobs you apply to will show up here so you can track their status."
                actionLabel="Browse jobs"
                actionHref="/freelancer/jobs"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {isLoading ? (
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
          <Card>
            <h3>Recent notifications</h3>
            <div className="mt-4">
              <EmptyState
                icon={<Bell className="h-6 w-6" />}
                title="You're all caught up"
                description="New notifications about your applications and contracts will appear here."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
