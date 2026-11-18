"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { homePathFor } from "@/lib/role-home";
import type { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isSuspended } = useAuth();
  const role = user?.role;

  const isWrongRole =
    !isLoading && allowedRoles && role ? !allowedRoles.includes(role) : false;

  useEffect(() => {
    if (isLoading) return;
    if (isSuspended) {
      router.replace("/suspended");
      return;
    }
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Send people to their own area instead of dropping them on the homepage.
    if (isWrongRole && role) {
      router.replace(homePathFor(role));
    }
  }, [isLoading, isSuspended, isAuthenticated, isWrongRole, role, router]);

  if (isLoading || isSuspended || !isAuthenticated || isWrongRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
