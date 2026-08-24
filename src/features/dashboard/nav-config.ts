"use client"
import {
  LayoutDashboard,
  User,
  Search,
  Bookmark,
  FileText,
  Briefcase,
  Bell,
  Settings,
  Building2,
  PlusCircle,
  Users,
  FileSignature,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const freelancerNavItems: NavItem[] = [
  { label: "Overview", href: "/freelancer/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/freelancer/profile", icon: User },
  { label: "Browse Jobs", href: "/freelancer/jobs", icon: Search },
  { label: "Saved Jobs", href: "/freelancer/saved-jobs", icon: Bookmark },
  { label: "My Applications", href: "/freelancer/applications", icon: FileText },
  { label: "My Contracts", href: "/freelancer/contracts", icon: Briefcase },
  { label: "Notifications", href: "/freelancer/notifications", icon: Bell },
  { label: "Settings", href: "/freelancer/settings", icon: Settings },
];

export const clientNavItems: NavItem[] = [
  { label: "Overview", href: "/client/dashboard", icon: LayoutDashboard },
  { label: "Company Profile", href: "/client/profile", icon: Building2 },
  { label: "Post a Job", href: "/client/jobs/create", icon: PlusCircle },
  { label: "My Jobs", href: "/client/jobs", icon: Briefcase },
  { label: "Applications", href: "/client/applications", icon: Users },
  { label: "Contracts", href: "/client/contracts", icon: FileSignature },
  { label: "Payments", href: "/client/payments", icon: CreditCard },
  { label: "Notifications", href: "/client/notifications", icon: Bell },
  { label: "Settings", href: "/client/settings", icon: Settings },
];