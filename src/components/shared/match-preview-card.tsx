"use client";

import { motion } from "framer-motion";

export function MatchPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-card border-border bg-surface mx-auto w-full max-w-md border p-6 shadow-lg"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-text-secondary text-xs font-medium">Freelancer</p>
          <p className="text-text-primary text-sm font-semibold">Sarah K.</p>
          <p className="text-text-secondary text-xs">
            React · TypeScript · Node.js
          </p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-brand-50 text-brand-700 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        >
          94%
        </motion.div>
        <div className="text-right">
          <p className="text-text-secondary text-xs font-medium">Job</p>
          <p className="text-text-primary text-sm font-semibold">
            Frontend Engineer
          </p>
          <p className="text-text-secondary text-xs">React · TS · REST APIs</p>
        </div>
      </div>
      <div className="bg-status-active/10 mt-4 flex items-center gap-2 rounded-md px-3 py-2">
        <span className="bg-status-active h-2 w-2 rounded-full" />
        <span className="text-text-primary text-xs font-medium">
          Strong skill match — 3 shared requirements
        </span>
      </div>
    </motion.div>
  );
}
