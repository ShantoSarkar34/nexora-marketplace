"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/features/dashboard/nav-config";
import type { UserRole } from "@/features/auth/schemas";

interface SidebarContentProps {
  navItems: NavItem[];
  role: UserRole;
  onNavigate?: () => void;
}

const accentText: Record<UserRole, string> = {
  FREELANCER: "text-freelancer-500",
  CLIENT: "text-client-500",
};

const accentBg: Record<UserRole, string> = {
  FREELANCER: "bg-freelancer-500/10",
  CLIENT: "bg-client-500/10",
};

export function SidebarContent({
  navItems,
  role,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-text-primary text-xl font-bold">
          Nex<span className="text-brand-600">ora</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? cn(accentBg[role], accentText[role])
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-4">
        <p className="text-text-secondary text-xs">
          {role === "FREELANCER" ? "Freelancer account" : "Client account"}
        </p>
      </div>
    </div>
  );
}
