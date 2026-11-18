"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminShell } from "@/features/admin/admin-shell";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminArea>{children}</AdminArea>
    </ProtectedRoute>
  );
}

function AdminArea({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  // ProtectedRoute owns the loading and redirect states.
  if (!user) return null;
  return <AdminShell user={user}>{children}</AdminShell>;
}