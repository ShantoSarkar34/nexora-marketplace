"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  accent?: "brand" | "freelancer" | "client";
}

const accentClasses = {
  brand: "bg-brand-50 text-brand-700",
  freelancer: "bg-freelancer-500/10 text-freelancer-500",
  client: "bg-client-500/10 text-client-500",
};

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  icon: Icon,
  accent = "brand",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
            accentClasses[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-text-primary">
            <CountUp value={value} prefix={prefix} suffix={suffix} duration={0.8} />
          </p>
          <p className="text-sm text-text-secondary">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}