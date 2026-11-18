"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Menu, Settings } from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useLogout } from "@/hooks/use-auth-mutations";
import type { AuthUser } from "@/types/user";

interface AdminTopbarProps {
  user: AuthUser;
  onMenuClick: () => void;
}

export function AdminTopbar({ user, onMenuClick }: AdminTopbarProps) {
  const router = useRouter();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout.mutateAsync();
    router.push("/");
  }

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
        <ThemeToggle />

        <div className="bg-border mx-1 hidden h-6 w-px sm:block" />

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="hover:bg-surface-muted flex items-center gap-2 rounded-md py-1 pr-2 pl-1"
          >
            <Avatar name={user.name} imageUrl={user.imageUrl} size="sm" />
            <span className="text-text-primary hidden text-sm font-medium sm:block">
              {user.name}
            </span>
            <ChevronDown className="text-text-secondary hidden h-3.5 w-3.5 sm:block" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="border-border bg-surface absolute right-0 mt-2 w-60 overflow-hidden rounded-md border shadow-lg"
              >
                <div className="border-border border-b px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-text-primary truncate text-sm font-medium">
                      {user.name}
                    </p>
                    <Badge variant="brand">Admin</Badge>
                  </div>
                  <p className="text-text-secondary truncate text-xs">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/admin/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="text-text-primary hover:bg-surface-muted flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="text-status-error hover:bg-surface-muted border-border flex w-full items-center gap-2 border-t px-3 py-2 text-left text-sm"
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
