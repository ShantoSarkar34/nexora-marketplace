"use client";

import {
  Briefcase,
  Lock,
  Percent,
  RotateCcw,
  Scale,
  UserX,
  Users,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { StatCardSkeleton } from "@/components/dashboard/stat-card-skeleton";
import { StatsLoadError } from "@/components/dashboard/stats-load-error";
import { StatusBreakdownCard } from "@/components/dashboard/status-breakdown-card";
import { countOf } from "@/features/dashboard/utils";
import {
  SummaryTile,
  SummaryTileSkeleton,
} from "@/features/payments/components/summary-tile";
import { formatMoney } from "@/features/payments/utils";
import { useAdminStats } from "@/hooks/use-admin";
import {
  contractStatusLabels,
  jobStatusLabels,
  type ContractStatus,
  type JobStatus,
} from "@/types/enums";
import type { UserRole } from "@/types/user";

const roleLabels: Record<UserRole, string> = {
  CLIENT: "Clients",
  FREELANCER: "Freelancers",
  ADMIN: "Admins",
};

export function AdminOverview() {
  const stats = useAdminStats();
  const data = stats.data;

  return (
    <div className="space-y-6">
      <div>
        <h1>Admin overview</h1>
        <p className="text-text-secondary mt-1">
          Platform activity at a glance.
        </p>
      </div>

      {stats.isLoading ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SummaryTileSkeleton key={index} />
            ))}
          </div>
        </>
      ) : stats.isError || !data ? (
        <StatsLoadError onRetry={() => stats.refetch()} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total users"
              value={data.users.total}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              label="Suspended accounts"
              value={data.users.suspended}
              icon={<UserX className="h-5 w-5" />}
            />
            <StatCard
              label="Open jobs"
              value={countOf(data.jobs, "OPEN")}
              icon={<Briefcase className="h-5 w-5" />}
            />
            <StatCard
              label="Open disputes"
              value={data.disputes.open}
              icon={<Scale className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryTile
              label="Total revenue"
              value={formatMoney(data.revenue.totalRevenue)}
              icon={<Wallet className="h-5 w-5" />}
            />
            <SummaryTile
              label="Platform fees"
              value={formatMoney(data.revenue.platformFees)}
              icon={<Percent className="h-5 w-5" />}
            />
            <SummaryTile
              label="In escrow"
              value={formatMoney(data.revenue.inEscrow)}
              icon={<Lock className="h-5 w-5" />}
            />
            <SummaryTile
              label="Refunded"
              value={formatMoney(data.revenue.refunded)}
              icon={<RotateCcw className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <StatusBreakdownCard
              title="Users by role"
              total={data.users.total}
              rows={(["CLIENT", "FREELANCER", "ADMIN"] as UserRole[]).map(
                (role) => ({
                  key: role,
                  label: roleLabels[role],
                  count: data.users.byRole[role] ?? 0,
                }),
              )}
              footerHref="/admin/users"
              footerLabel="Manage users →"
            />
            <StatusBreakdownCard
              title="Jobs by status"
              total={data.jobs.total}
              rows={(Object.keys(jobStatusLabels) as JobStatus[]).map(
                (status) => ({
                  key: status,
                  label: jobStatusLabels[status],
                  count: countOf(data.jobs, status),
                }),
              )}
            />
            <StatusBreakdownCard
              title="Contracts by status"
              total={data.contracts.total}
              rows={(Object.keys(contractStatusLabels) as ContractStatus[]).map(
                (status) => ({
                  key: status,
                  label: contractStatusLabels[status],
                  count: countOf(data.contracts, status),
                }),
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
