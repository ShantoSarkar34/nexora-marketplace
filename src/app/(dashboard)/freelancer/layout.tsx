"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { freelancerNavItems } from "@/features/dashboard/nav-config";
import { useAuth } from "@/hooks/use-auth";

export default function FreelancerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["FREELANCER"]}>
      <FreelancerShell>{children}</FreelancerShell>
    </ProtectedRoute>
  );
}

function FreelancerShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <DashboardShell navItems={freelancerNavItems} user={user}>
      {children}
    </DashboardShell>
  );
}
