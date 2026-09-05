"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { applicationStatusLabels } from "@/types/enums";
import { useMyApplications } from "@/hooks/use-applications";
import type { ApplicationStatus } from "@/types/enums";

const PAGE_SIZE = 10;

export default function MyApplicationsPage() {
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMyApplications({
    status: filter,
    page,
    limit: PAGE_SIZE,
  });
  const applications = data?.applications ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>My Applications</h1>
          <p className="text-text-secondary mt-1">
            Track the status of jobs you&apos;ve applied to.
          </p>
        </div>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as ApplicationStatus | "ALL");
            setPage(1);
          }}
          className="w-48"
        >
          <option value="ALL">All statuses</option>
          {Object.entries(applicationStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No applications found"
          description="Applications matching this filter will appear here."
          actionLabel="Browse jobs"
          actionHref="/freelancer/jobs"
        />
      ) : (
        <>
          <div className="space-y-4">
            {applications.map((app) => (
              <Link key={app.id} href={`/freelancer/applications/${app.id}`}>
                <Card className="hover:border-brand-300 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-text-primary text-base font-semibold">
                        {app.jobTitle}
                      </h3>
                      <p className="text-text-secondary mt-1 text-xs">
                        {app.clientName} · Applied{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                  <div className="text-text-secondary mt-3 flex gap-4 text-sm">
                    <span>Proposed: ${app.proposedBudget}</span>
                    <span>Est. {app.estimatedDeliveryDays} days</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
