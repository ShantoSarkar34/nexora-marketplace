"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { SidebarContent } from "@/components/dashboard/sidebar-content";
import type { NavItem } from "@/features/dashboard/nav-config";
import type { UserRole } from "@/features/auth/schemas";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  role: UserRole;
}

export function MobileSidebar({
  isOpen,
  onClose,
  navItems,
  role,
}: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="bg-surface fixed inset-y-0 left-0 z-50 w-72 shadow-xl md:hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="text-text-secondary hover:bg-surface-muted absolute top-4 right-3 flex h-9 w-9 items-center justify-center rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              navItems={navItems}
              role={role}
              onNavigate={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
