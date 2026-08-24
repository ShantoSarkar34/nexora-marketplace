import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { freelancerNavItems } from "@/features/dashboard/nav-config";
import { mockUsers } from "@/lib/mock-data/dashboard";

// Track B: swap mockUsers.FREELANCER for the real authenticated user,
// and add role + ownership checks (redirect non-freelancers away).
export default function FreelancerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell navItems={freelancerNavItems} user={mockUsers.FREELANCER}>
      {children}
    </DashboardShell>
  );
}