"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { localeNames, locales } from "@/lib/i18n/dictionaries";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={isOpen}
        className="text-text-secondary hover:bg-surface-muted hover:text-text-primary flex h-9 w-9 items-center justify-center rounded-md"
      >
        <Globe className="h-4.5 w-4.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="border-border bg-surface absolute right-0 mt-2 w-36 overflow-hidden rounded-md border shadow-lg"
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setIsOpen(false);
                }}
                className={cn(
                  "hover:bg-surface-muted flex w-full items-center px-3 py-2 text-left text-sm",
                  locale === l
                    ? "text-brand-600 font-medium"
                    : "text-text-primary",
                )}
              >
                {localeNames[l]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
