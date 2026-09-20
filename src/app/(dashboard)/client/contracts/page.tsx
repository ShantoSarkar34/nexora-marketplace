"use client";

import Link from "next/link";
import { FileSignature } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import { useMyContracts } from "@/hooks/use-contracts";
import { Avatar } from "@/components/shared/avatar";

export default function ClientContractsPage() {
  const { data: contracts, isLoading } = useMyContracts();

  // console.log(contracts)

  return (
    <div className="space-y-6">
      <div>
        <h1>Contracts</h1>
        <p className="text-text-secondary mt-1">
          Manage active and completed work.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !contracts || contracts.length === 0 ? (
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
                  <div className="flex items-center gap-3">
                    <Avatar name={c.freelancerName} imageUrl={c.freelancerImageUrl} accent="freelancer" />
                    <div>
                      <h3 className="text-text-primary text-base font-semibold">
                        {c.jobTitle}
                      </h3>
                      <p className="text-text-secondary mt-0.5 text-xs">
                        Freelancer:{" "}
                        <span className="text-text-primary font-medium">
                          {c.freelancerName}
                        </span>
                      </p>
                      <p className="text-text-secondary text-xs">
                        Started {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <ContractStatusBadge status={c.status} />
                    <span className="text-text-primary text-xs font-medium">
                      ${c.agreedBudget}
                    </span>
                  </div>
                </div>
                {c.status === "PENDING" && (
                  <p className="text-status-pending mt-2 text-xs">
                    Payment required to activate this contract.
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
