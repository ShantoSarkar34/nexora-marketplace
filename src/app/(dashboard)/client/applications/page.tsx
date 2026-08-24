"use client";

import Link from "next/link";
import { Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ApplicationStatusBadge } from "@/features/applications/status-badge";
import { mockJobApplicants } from "@/lib/mock-data/applications";

export default function ClientApplicationsPage() {
  // Track B: replace with GET /applications?clientId=me (optionally &jobId=)
  const applicants = mockJobApplicants;

  return (
    <div className="space-y-6">
      <div>
        <h1>Applications</h1>
        <p className="text-text-secondary mt-1">
          Review applicants across your posted jobs.
        </p>
      </div>

      {applicants.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No applications yet"
          description="Applications to your jobs will appear here."
        />
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <Link key={app.id} href={`/client/applications/${app.id}`}>
              <Card className="hover:border-brand-300 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-100 text-brand-700 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                      {app.freelancerAvatarInitials}
                    </span>
                    <div>
                      <p className="text-text-primary text-sm font-semibold">
                        {app.freelancerName}
                      </p>
                      <p className="text-text-secondary text-xs">
                        Applied for {app.jobTitle}
                      </p>
                    </div>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
