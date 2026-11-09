"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavBadge } from "@/components/dashboard/nav-badge";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/features/dashboard/nav-config";
import type { UserRole } from "@/types/user";

interface SidebarContentProps {
  navItems: NavItem[];
  role: UserRole;
  onNavigate?: () => void;
}

const accentText: Record<UserRole, string> = {
  FREELANCER: "text-freelancer-500",
  CLIENT: "text-client-500",
  ADMIN: "text-brand-600",
};

const accentBg: Record<UserRole, string> = {
  FREELANCER: "bg-freelancer-500/10",
  CLIENT: "bg-client-500/10",
  ADMIN: "bg-brand-500/10",
};

const roleLabel: Record<UserRole, string> = {
  FREELANCER: "Freelancer account",
  CLIENT: "Client account",
  ADMIN: "Admin account",
};

// The longest matching link wins, so /client/messages/abc highlights Messages,
// and /client/jobs/create highlights Post a Job but not My Jobs.
function findActiveHref(pathname: string, navItems: NavItem[]) {
  let best: string | null = null;
  for (const item of navItems) {
    const matches =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (matches && (!best || item.href.length > best.length)) {
      best = item.href;
    }
  }
  return best;
}

export function SidebarContent({
  navItems,
  role,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname() ?? "";
  const activeHref = findActiveHref(pathname, navItems);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-text-primary text-xl font-bold">
          Nex<span className="text-brand-600">ora</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? cn(accentBg[role], accentText[role])
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge === "messages" && <NavBadge />}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-4">
        <p className="text-text-secondary text-xs">{roleLabel[role]}</p>
      </div>
    </div>
  );
}
