"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { mockApplications } from "@/lib/mock-data/applications";
import type { ApplicationStatus } from "@/types/application";

export default function MyApplicationsPage() {
  // Track B: replace with GET /applications?freelancerId=me&status=
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");

  const applications =
    filter === "ALL"
      ? mockApplications
      : mockApplications.filter((a) => a.status === filter);

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
          onChange={(e) =>
            setFilter(e.target.value as ApplicationStatus | "ALL")
          }
          className="w-48"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="HIRED">Hired</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </Select>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No applications found"
          description="Applications matching this filter will appear here."
          actionLabel="Browse jobs"
          actionHref="/freelancer/jobs"
        />
      ) : (
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
                      {app.clientName} · Applied {app.appliedAt}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
                <div className="text-text-secondary mt-3 flex gap-4 text-sm">
                  <span>Proposed: ${app.proposedBudget}</span>
                  <span>Est. {app.estimatedDays} days</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
