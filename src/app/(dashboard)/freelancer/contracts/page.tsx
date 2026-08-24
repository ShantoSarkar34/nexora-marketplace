"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { mockContracts } from "@/lib/mock-data/contracts";

export default function FreelancerContractsPage() {
  // Track B: replace with GET /contracts?freelancerId=me
  const contracts = mockContracts;

  return (
    <div className="space-y-6">
      <div>
        <h1>My Contracts</h1>
        <p className="text-text-secondary mt-1">
          Manage your active and past work.
        </p>
      </div>

      {contracts.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No contracts yet"
          description="Contracts begin once a client hires you for a job."
        />
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => (
            <Link key={c.id} href={`/freelancer/contracts/${c.id}`}>
              <Card className="hover:border-brand-300 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-text-primary text-base font-semibold">
                      {c.jobTitle}
                    </h3>
                    <p className="text-text-secondary mt-1 text-xs">
                      {c.clientName} · Started {c.startedAt}
                    </p>
                  </div>
                  <ContractStatusBadge status={c.status} />
                </div>
                <p className="text-text-primary mt-3 text-sm font-medium">
                  ${c.budget}
                  {c.budgetType === "HOURLY" ? "/hr" : " fixed"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
