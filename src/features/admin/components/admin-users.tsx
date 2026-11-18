"use client";

import { useState } from "react";
import { Search, SearchX } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  SuspensionDialog,
  type SuspensionTarget,
} from "@/features/admin/components/suspension-dialog";
import { formatContractDate } from "@/features/contracts/utils";
import { useAdminUsers } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/admin";
import type { UserRole } from "@/types/user";

const PAGE_SIZE = 10;

type VerifiedFilter = "ALL" | "VERIFIED" | "UNVERIFIED";

const roleLabels: Record<UserRole, string> = {
  CLIENT: "Client",
  FREELANCER: "Freelancer",
  ADMIN: "Admin",
};

function accentFor(role: UserRole) {
  return role === "CLIENT"
    ? ("client" as const)
    : role === "FREELANCER"
      ? ("freelancer" as const)
      : ("brand" as const);
}

function StatusBadge({ user }: { user: AdminUser }) {
  if (user.isDeleted) return <Badge variant="neutral">Deleted</Badge>;
  if (user.isSuspended) return <Badge variant="error">Suspended</Badge>;
  return <Badge variant="success">Active</Badge>;
}

export function AdminUsers() {
  const { user: me } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 400);
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [verified, setVerified] = useState<VerifiedFilter>("ALL");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<SuspensionTarget | null>(null);

  const { data, isLoading, isError, isPlaceholderData, refetch } = useAdminUsers({
    search: search.trim() || undefined,
    role: role === "ALL" ? undefined : role,
    isVerified: verified === "ALL" ? undefined : verified === "VERIFIED",
    page,
    limit: PAGE_SIZE,
  });

  const users = data?.users ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilters = searchInput.trim() !== "" || role !== "ALL" || verified !== "ALL";

  function clearFilters() {
    setSearchInput("");
    setRole("ALL");
    setVerified("ALL");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Users</h1>
        <p className="text-text-secondary mt-1">
          {isLoading
            ? "Loading users..."
            : `${total} account${total === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-text-secondary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as UserRole | "ALL");
            setPage(1);
          }}
          className="sm:w-40"
          aria-label="Filter by role"
        >
          <option value="ALL">All roles</option>
          <option value="CLIENT">Clients</option>
          <option value="FREELANCER">Freelancers</option>
          <option value="ADMIN">Admins</option>
        </Select>
        <Select
          value={verified}
          onChange={(e) => {
            setVerified(e.target.value as VerifiedFilter);
            setPage(1);
          }}
          className="sm:w-44"
          aria-label="Filter by verification"
        >
          <option value="ALL">Any verification</option>
          <option value="VERIFIED">Verified</option>
          <option value="UNVERIFIED">Not verified</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError && !data ? (
        <div className="border-border bg-surface rounded-md border px-6 py-12 text-center">
          <p className="text-text-primary font-medium">
            We couldn&apos;t load users.
          </p>
          <Button className="mt-5" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="border-border rounded-card flex flex-col items-center justify-center gap-3 border border-dashed py-16 text-center">
          <SearchX className="text-text-secondary h-8 w-8" />
          <p className="text-text-primary text-sm font-medium">
            No users match your search
          </p>
          {hasFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear search and filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <Card
            className={cn(
              "overflow-hidden p-0",
              isPlaceholderData && "opacity-60 transition-opacity",
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl text-left text-sm">
                <thead>
                  <tr className="border-border text-text-secondary border-b text-xs">
                    <th scope="col" className="px-4 py-3 font-medium">
                      User
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Verification
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Joined
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isSelf = user.id === me?.id;
                    // Admins and your own account can't be suspended from here,
                    // so nobody gets locked out by mistake.
                    const canManage =
                      !isSelf && user.role !== "ADMIN" && !user.isDeleted;

                    return (
                      <tr
                        key={user.id}
                        className="border-border border-b last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={user.name}
                              imageUrl={user.imageUrl}
                              size="sm"
                              accent={accentFor(user.role)}
                            />
                            <div className="min-w-0">
                              <p className="text-text-primary truncate font-medium">
                                {user.name}
                                {isSelf && (
                                  <span className="text-text-secondary ml-1.5 text-xs font-normal">
                                    (you)
                                  </span>
                                )}
                              </p>
                              <p className="text-text-secondary truncate text-xs">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={user.role === "ADMIN" ? "brand" : "neutral"}
                          >
                            {roleLabels[user.role]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.isVerified ? "success" : "warning"}>
                            {user.isVerified ? "Verified" : "Not verified"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge user={user} />
                          {user.isSuspended && user.suspensionReason && (
                            <p
                              className="text-text-secondary mt-1 max-w-48 truncate text-xs"
                              title={user.suspensionReason}
                            >
                              {user.suspensionReason}
                            </p>
                          )}
                        </td>
                        <td className="text-text-secondary px-4 py-3 whitespace-nowrap">
                          {formatContractDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {canManage ? (
                            <Button
                              size="sm"
                              variant={user.isSuspended ? "secondary" : "destructive"}
                              onClick={() =>
                                setTarget({ user, suspend: !user.isSuspended })
                              }
                            >
                              {user.isSuspended ? "Restore access" : "Suspend"}
                            </Button>
                          ) : (
                            <span className="text-text-secondary text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <SuspensionDialog target={target} onClose={() => setTarget(null)} />
    </div>
  );
}