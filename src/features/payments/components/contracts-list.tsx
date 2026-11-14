"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSignature } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Avatar } from "@/components/shared/avatar";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ContractStatusBadge } from "@/features/contracts/status-badge";
import {
  contractHint,
  formatContractBudget,
  formatContractDate,
  type ContractRole,
} from "@/features/contracts/utils";
import { useContractsPage } from "@/hooks/use-contracts";
import { cn } from "@/lib/utils";
import { contractStatusLabels, type ContractStatus } from "@/types/enums";

const PAGE_SIZE = 10;

export function ContractsList({ role }: { role: ContractRole }) {
  const [status, setStatus] = useState<ContractStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useContractsPage({
    status,
    page,
    limit: PAGE_SIZE,
  });

  const contracts = data?.contracts ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const isClient = role === "CLIENT";
  const basePath = isClient ? "/client/contracts" : "/freelancer/contracts";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>{isClient ? "Contracts" : "My Contracts"}</h1>
          <p className="text-text-secondary mt-1">
            {isClient
              ? "Manage active and completed work."
              : "Manage your active and past work."}
          </p>
        </div>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ContractStatus | "ALL");
            setPage(1);
          }}
          className="w-64"
          aria-label="Filter contracts by status"
        >
          <option value="ALL">All statuses</option>
          {Object.entries(contractStatusLabels).map(([value, label]) => (
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
      ) : isError && !data ? (
        <div className="border-border bg-surface rounded-md border px-6 py-12 text-center">
          <p className="text-text-primary font-medium">
            We couldn&apos;t load your contracts.
          </p>
          <p className="text-text-secondary mt-2 text-sm">
            Please try again in a moment.
          </p>
          <Button className="mt-5" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : contracts.length === 0 ? (
        <EmptyState
          icon={<FileSignature className="h-6 w-6" />}
          title={status === "ALL" ? "No contracts yet" : "No contracts found"}
          description={
            status === "ALL"
              ? isClient
                ? "Contracts appear here once you hire a freelancer."
                : "Contracts begin once a client hires you for a job."
              : "Contracts with this status will appear here."
          }
          actionLabel={
            status === "ALL"
              ? isClient
                ? "View applicants"
                : "Browse jobs"
              : undefined
          }
          actionHref={
            status === "ALL"
              ? isClient
                ? "/client/applications"
                : "/freelancer/jobs"
              : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {contracts.map((contract) => {
              const hint = contractHint(contract, role);
              const counterpart = isClient
                ? {
                    label: "Freelancer",
                    name: contract.freelancerName,
                    imageUrl: contract.freelancerImageUrl,
                    accent: "freelancer" as const,
                  }
                : {
                    label: "Client",
                    name: contract.clientName,
                    imageUrl: contract.clientImageUrl,
                    accent: "client" as const,
                  };

              return (
                <Link
                  key={contract.id}
                  href={`${basePath}/${contract.id}`}
                  className="block"
                >
                  <Card className="hover:border-brand-300 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          name={counterpart.name}
                          imageUrl={counterpart.imageUrl}
                          accent={counterpart.accent}
                        />
                        <div className="min-w-0">
                          <h3 className="text-text-primary truncate text-base font-semibold">
                            {contract.jobTitle}
                          </h3>
                          <p className="text-text-secondary mt-0.5 text-xs">
                            {counterpart.label}:{" "}
                            <span className="text-text-primary font-medium">
                              {counterpart.name}
                            </span>
                          </p>
                          <p className="text-text-secondary text-xs">
                            Started {formatContractDate(contract.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <ContractStatusBadge status={contract.status} />
                        <span className="text-text-primary text-xs font-medium">
                          {formatContractBudget(contract)}
                        </span>
                      </div>
                    </div>

                    {hint && (
                      <p
                        className={cn(
                          "mt-3 text-xs",
                          hint.tone === "warning"
                            ? "text-status-pending"
                            : "text-text-secondary",
                        )}
                      >
                        {hint.text}
                      </p>
                    )}
                  </Card>
                </Link>
              );
            })}
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
