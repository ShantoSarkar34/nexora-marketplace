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
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  // Shows a live count next to the label.
  badge?: "messages";
}

export const freelancerNavItems: NavItem[] = [
  { label: "Overview", href: "/freelancer/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/freelancer/profile", icon: User },
  { label: "Browse Jobs", href: "/freelancer/jobs", icon: Search },
  { label: "Matched Jobs", href: "/freelancer/recommended", icon: Sparkles },
  { label: "Saved Jobs", href: "/freelancer/saved-jobs", icon: Bookmark },
  {
    label: "My Applications",
    href: "/freelancer/applications",
    icon: FileText,
  },
  { label: "Invitations", href: "/freelancer/invitations", icon: Mail },
  {
    label: "Messages",
    href: "/freelancer/messages",
    icon: MessageSquare,
    badge: "messages",
  },
  { label: "My Contracts", href: "/freelancer/contracts", icon: Briefcase },
  { label: "Earnings", href: "/freelancer/earnings", icon: Wallet },
  { label: "Notifications", href: "/freelancer/notifications", icon: Bell },
  { label: "Settings", href: "/freelancer/settings", icon: Settings },
];

export const clientNavItems: NavItem[] = [
  { label: "Overview", href: "/client/dashboard", icon: LayoutDashboard },
  { label: "Company Profile", href: "/client/profile", icon: Building2 },
  { label: "Post a Job", href: "/client/jobs/create", icon: PlusCircle },
  { label: "My Jobs", href: "/client/jobs", icon: Briefcase },
  { label: "Applications", href: "/client/applications", icon: Users },
  { label: "Invitations", href: "/client/invitations", icon: Send },
  {
    label: "Messages",
    href: "/client/messages",
    icon: MessageSquare,
    badge: "messages",
  },
  { label: "Contracts", href: "/client/contracts", icon: FileSignature },
  { label: "Payments", href: "/client/payments", icon: CreditCard },
  { label: "Notifications", href: "/client/notifications", icon: Bell },
  { label: "Settings", href: "/client/settings", icon: Settings },
];
