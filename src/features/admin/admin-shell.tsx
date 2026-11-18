"use client";

import { useState } from "react";

import { DesktopSidebar } from "@/components/dashboard/desktop-sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { adminNavItems } from "@/features/admin/nav-config";
import type { AuthUser } from "@/types/user";
import { AdminTopbar } from "./admin-topbar";

interface AdminShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-surface-muted min-h-screen">
      <DesktopSidebar navItems={adminNavItems} role={user.role} />
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={adminNavItems}
        role={user.role}
      />

      <div className="md:pl-64">
        <AdminTopbar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
