"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Callers often pass an inline function. Keeping the latest one in a ref
  // means the effect below only runs when the dialog opens or closes, so a
  // re-render of the parent never steals focus from the field you're typing in.
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    // Stop the page from scrolling behind the dialog.
    document.body.style.overflow = "hidden";

    // Start on the first field or button in the content, not the close button.
    const firstField =
      contentRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panel;
    firstField?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChangeRef.current(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      // Keep Tab inside the dialog.
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        e.preventDefault();
        return;
      }

      const active = document.activeElement;
      const outside = !panel.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      // Hand focus back to whatever opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/40"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="border-border bg-surface rounded-card fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border p-6 shadow-xl focus:outline-none"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id={titleId}>{title}</h3>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="text-text-secondary hover:bg-surface-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div ref={contentRef} className="mt-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
