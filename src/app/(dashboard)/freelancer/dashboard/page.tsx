"use client";
import { Bell, Briefcase, Bookmark, FileText, TrendingUp } from "lucide-react";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { mockUsers } from "@/lib/mock-data/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";

export default function FreelancerDashboardPage() {
  const user = mockUsers.FREELANCER;

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
          value={12}
          icon={FileText}
          accent="freelancer"
        />
        <StatCard
          label="Active contracts"
          value={2}
          icon={Briefcase}
          accent="freelancer"
        />
        <StatCard
          label="Saved jobs"
          value={7}
          icon={Bookmark}
          accent="freelancer"
        />
        <StatCard
          label="Avg. match score"
          value={87}
          suffix="%"
          icon={TrendingUp}
          accent="freelancer"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3>Recent applications</h3>
            <div className="mt-4">
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Jobs you apply to will show up here so you can track their status."
                actionLabel="Browse jobs"
                actionHref="/freelancer/jobs"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <ProfileCompletionCard percentage={user.profileCompletion ?? 0} />
          <Card>
            <h3>Recent notifications</h3>
            <div className="mt-4">
              <EmptyState
                icon={Bell}
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
