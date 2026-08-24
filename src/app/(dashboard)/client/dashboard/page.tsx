import {
  Bell,
  Briefcase,
  DollarSign,
  FileSignature,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { mockUsers } from "@/lib/mock-data/dashboard";

export default function ClientDashboardPage() {
  const user = mockUsers.CLIENT;

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
          value={4}
          icon={<Briefcase className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Total applications"
          value={31}
          icon={<Users className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Active contracts"
          value={3}
          icon={<FileSignature className="h-5 w-5" />}
          accent="client"
        />
        <StatCard
          label="Total spent"
          value={5200}
          prefix="$"
          icon={<DollarSign className="h-5 w-5" />}
          accent="client"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3>Recent activity</h3>
            <div className="mt-4">
              <EmptyState
                icon={<Users className="h-5 w-5" />}
                title="No recent activity"
                description="Applications, hires, and contract updates will appear here as they happen."
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3>Job status</h3>
            <div className="mt-4">
              <EmptyState
                icon={<Briefcase className="h-5 w-5" />}
                title="No jobs posted yet"
                description="Post your first job to start receiving applications."
                actionLabel="Post a job"
                actionHref="/client/jobs/create"
              />
            </div>
          </Card>
          <Card>
            <h3>Notifications</h3>
            <div className="mt-4">
              <EmptyState
                icon={<Bell className="h-5 w-5" />}
                title="You're all caught up"
                description="New notifications will appear here."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
