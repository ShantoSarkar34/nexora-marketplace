"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Repeat,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import type { MockUser } from "@/lib/mock-data/dashboard";

interface TopbarProps {
  user: MockUser;
  onMenuClick: () => void;
  notificationCount?: number;
}

export function Topbar({
  user,
  onMenuClick,
  notificationCount = 0,
}: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const otherRoleHref =
    user.role === "FREELANCER" ? "/client/dashboard" : "/freelancer/dashboard";
  const otherRoleLabel =
    user.role === "FREELANCER" ? "Client view" : "Freelancer view";
  const profileHref =
    user.role === "FREELANCER" ? "/freelancer/profile" : "/client/profile";
  const settingsHref =
    user.role === "FREELANCER" ? "/freelancer/settings" : "/client/settings";
  const notificationsHref =
    user.role === "FREELANCER"
      ? "/freelancer/notifications"
      : "/client/notifications";

  return (
    <header className="border-border bg-surface/80 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-text-secondary flex h-9 w-9 items-center justify-center md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />

        <Link
          href={notificationsHref}
          aria-label="Notifications"
          className="text-text-secondary hover:bg-surface-muted hover:text-text-primary relative flex h-9 w-9 items-center justify-center rounded-md"
        >
          <Bell className="h-4.5 w-4.5" />
          {notificationCount > 0 && (
            <span className="bg-status-error absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </Link>

        <div className="bg-border mx-1 hidden h-6 w-px sm:block" />

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="hover:bg-surface-muted flex items-center gap-2 rounded-md py-1 pr-2 pl-1"
          >
            <span className="bg-brand-100 text-brand-700 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
              {user.avatarInitials}
            </span>
            <span className="text-text-primary hidden text-sm font-medium sm:block">
              {user.name}
            </span>
            <ChevronDown className="text-text-secondary hidden h-3.5 w-3.5 sm:block" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="border-border bg-surface absolute right-0 mt-2 w-56 overflow-hidden rounded-md border shadow-lg"
              >
                <div className="border-border border-b px-3 py-2.5">
                  <p className="text-text-primary text-sm font-medium">
                    {user.name}
                  </p>
                  <p className="text-text-secondary text-xs">{user.email}</p>
                </div>
                <Link
                  href={profileHref}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-primary hover:bg-surface-muted flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <UserIcon className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  href={settingsHref}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-primary hover:bg-surface-muted flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                {/* Dev convenience only — remove once real login/role switching exists */}
                <Link
                  href={otherRoleHref}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-secondary hover:bg-surface-muted flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Repeat className="h-4 w-4" />
                  Preview {otherRoleLabel}
                </Link>
                {/* Track B: wire to real logout -> clear session cookie + redirect */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="border-border text-status-error hover:bg-surface-muted flex w-full items-center gap-2 border-t px-3 py-2 text-left text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
