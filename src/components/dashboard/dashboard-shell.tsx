"use client";

import { useState } from "react";

import { DesktopSidebar } from "@/components/dashboard/desktop-sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { NavItem } from "@/features/dashboard/nav-config";
import type { MockUser } from "@/lib/mock-data/dashboard";

interface DashboardShellProps {
  navItems: NavItem[];
  user: MockUser;
  children: React.ReactNode;
}

export function DashboardShell({
  navItems,
  user,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-surface-muted min-h-screen">
      <DesktopSidebar navItems={navItems} role={user.role} />
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        role={user.role}
      />

      <div className="md:pl-64">
        <Topbar
          user={user}
          onMenuClick={() => setMobileOpen(true)}
          notificationCount={3}
        />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
