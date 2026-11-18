import { LayoutDashboard, Settings, Users } from "lucide-react";

import type { NavItem } from "@/features/dashboard/nav-config";

export const adminNavItems: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];