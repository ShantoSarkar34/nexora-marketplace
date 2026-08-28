"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { useLanguage } from "@/providers/language-provider";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/hooks/use-auth-mutations";
import { getInitials } from "@/lib/get-initials";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();
  const router = useRouter();

  const navLinks = [
    { href: "/jobs", label: t.nav.browseJobs },
    { href: "/freelancers", label: t.nav.findTalent },
    { href: "/about", label: t.nav.about },
  ];

  const dashboardHref =
    user?.role === "CLIENT" ? "/client/dashboard" : "/freelancer/dashboard";

  async function handleLogout() {
    setIsOpen(false);
    await logout.mutateAsync();
    router.push("/");
  }

  return (
    <header className="border-border bg-surface/80 sticky top-0 z-50 border-b backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-text-primary text-xl font-bold">
          Nex<span className="text-brand-600">ora</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-primary text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          <div className="bg-border mx-1 h-6 w-px" />
          {isLoading ? (
            <div className="bg-surface-muted h-8 w-20 animate-pulse rounded-md" />
          ) : isAuthenticated && user ? (
            <>
              <span className="bg-brand-100 text-brand-700 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                {getInitials(user.name)}
              </span>
              <Link href={dashboardHref}>
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                isLoading={logout.isPending}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t.nav.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t.nav.signup}</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="flex h-9 w-9 items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-border bg-surface overflow-hidden border-t md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated && user ? (
                  <>
                    <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                      <Button variant="secondary" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      className="w-full"
                      onClick={handleLogout}
                      isLoading={logout.isPending}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="secondary" className="w-full">
                        {t.nav.login}
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">{t.nav.signup}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
