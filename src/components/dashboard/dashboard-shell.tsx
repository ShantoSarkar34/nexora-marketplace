"use client";

import { useState } from "react";

import { DesktopSidebar } from "@/components/dashboard/desktop-sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { VerificationBanner } from "@/features/auth/components/verification-banner";
import type { NavItem } from "@/features/dashboard/nav-config";
import type { AuthUser } from "@/types/user";

interface DashboardShellProps {
  navItems: NavItem[];
  user: AuthUser;
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
        <Topbar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
          {!user.isVerified && <VerificationBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}
