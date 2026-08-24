import { SidebarContent } from "@/components/dashboard/sidebar-content";
import type { NavItem } from "@/features/dashboard/nav-config";
import type { UserRole } from "@/features/auth/schemas";

interface DesktopSidebarProps {
  navItems: NavItem[];
  role: UserRole;
}

export function DesktopSidebar({ navItems, role }: DesktopSidebarProps) {
  return (
    <aside className="border-border bg-surface hidden w-64 shrink-0 border-r md:block">
      <div className="fixed h-screen w-64">
        <SidebarContent navItems={navItems} role={role} />
      </div>
    </aside>
  );
}
