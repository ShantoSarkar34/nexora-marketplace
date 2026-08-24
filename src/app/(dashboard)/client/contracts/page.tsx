"use client";

import Link from "next/link";
import { FileSignature } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { mockContracts } from "@/lib/mock-data/contracts";

export default function ClientContractsPage() {
  // Track B: replace with GET /contracts?clientId=me
  const contracts = mockContracts;

  return (
    <div className="space-y-6">
      <div>
        <h1>Contracts</h1>
        <p className="mt-1 text-text-secondary">Manage active and completed work.</p>
      </div>

      {contracts.length === 0 ? (
        <EmptyState
          icon={<FileSignature className="h-6 w-6" />}
          title="No contracts yet"
          description="Contracts appear here once you hire a freelancer."
        />
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => (
            <Link key={c.id} href={`/client/contracts/${c.id}`}>
              <Card className="hover:border-brand-300 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">{c.jobTitle}</h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      {c.freelancerName} · Started {c.startedAt}
                    </p>
                  </div>
                  <ContractStatusBadge status={c.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}