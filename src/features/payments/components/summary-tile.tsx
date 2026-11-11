"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const accentClasses = {
  brand: "bg-brand-50 text-brand-700",
  freelancer: "bg-freelancer-500/10 text-freelancer-500",
  client: "bg-client-500/10 text-client-500",
};

interface SummaryTileProps {
  label: string;
  // Already formatted, so money keeps its cents.
  value: string;
  hint?: string;
  icon: ReactNode;
  accent?: keyof typeof accentClasses;
}

export function SummaryTile({
  label,
  value,
  hint,
  icon,
  accent = "brand",
}: SummaryTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
              accentClasses[accent],
            )}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-text-primary text-2xl font-semibold">{value}</p>
            <p className="text-text-secondary text-sm">{label}</p>
            {hint && <p className="text-text-secondary mt-1 text-xs">{hint}</p>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function SummaryTileSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="flex items-start gap-4">
        <div className="bg-surface-muted h-11 w-11 rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="bg-surface-muted h-6 w-1/2 rounded" />
          <div className="bg-surface-muted h-3 w-2/3 rounded" />
        </div>
      </div>
    </Card>
  );
}