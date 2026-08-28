"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { clientNavItems } from "@/features/dashboard/nav-config";
import { useAuth } from "@/hooks/use-auth";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <ClientShell>{children}</ClientShell>
    </ProtectedRoute>
  );
}

function ClientShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <DashboardShell navItems={clientNavItems} user={user}>
      {children}
    </DashboardShell>
  );
}
