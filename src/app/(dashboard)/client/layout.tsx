import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { clientNavItems } from "@/features/dashboard/nav-config";
import { mockUsers } from "@/lib/mock-data/dashboard";

// Track B: swap mockUsers.CLIENT for the real authenticated user,
// and add role + ownership checks (redirect non-clients away).
export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell navItems={clientNavItems} user={mockUsers.CLIENT}>
      {children}
    </DashboardShell>
  );
}