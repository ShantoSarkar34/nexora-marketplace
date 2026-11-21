"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Code2,
  Layers3,
  type LucideIcon,
  MapPin,
  PenTool,
  Sparkles,
  Star,
} from "lucide-react";

import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function TalentPreviewCard() {
  return (
    <div className="border-border bg-surface rounded-2xl border p-3.5 shadow-sm sm:p-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar name="Ayesha Rahman" size="lg" accent="brand" />
          <span className="border-surface bg-status-active absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-text-primary truncate text-sm font-semibold">
              Ayesha Rahman
            </p>
            <BadgeCheck className="text-brand-600 h-4 w-4 shrink-0" />
          </div>
          <p className="text-text-secondary mt-0.5 text-xs">
            Product Designer · UI/UX
          </p>

          <div className="text-text-tertiary mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Dhaka, BD
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="fill-status-pending text-status-pending h-3 w-3" />
              4.9
              <span className="text-text-tertiary">(32)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="brand">Product design</Badge>
        <Badge variant="neutral">Figma</Badge>
        <Badge variant="neutral">Design systems</Badge>
      </div>

      <div className="border-border mt-3 flex items-center justify-between gap-2 border-t pt-2.5">
        <span className="text-text-secondary text-[11px]">
          From <span className="text-text-primary font-semibold">$45/hr</span>
        </span>
        <span className="bg-status-active/10 text-status-active inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
          <span className="bg-status-active h-1.5 w-1.5 rounded-full" />
          Available
        </span>
      </div>
    </div>
  );
}

function ProjectPreviewCard() {
  return (
    <div className="border-border bg-surface rounded-2xl border p-3.5 shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="bg-accent-500/10 text-accent-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <BriefcaseBusiness className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-text-primary truncate text-sm font-semibold">
              Senior Product Designer
            </p>
            <p className="text-text-secondary mt-0.5 text-xs">
              Northstar Studio · Remote
            </p>
          </div>
        </div>
        <Badge variant="success">Open</Badge>
      </div>

      <div className="text-text-secondary mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
        <span className="text-text-primary font-semibold">$2,400</span>
        <span>Fixed price</span>
        <span className="bg-border-strong h-1 w-1 rounded-full" />
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3 w-3" />2 weeks
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge variant="neutral">UX research</Badge>
        <Badge variant="neutral">Prototyping</Badge>
        <Badge variant="neutral">Figma</Badge>
      </div>
    </div>
  );
}

function SkillChip({
  icon: Icon,
  label,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  accent?: boolean;
}) {
  return (
    <span className="border-border bg-surface/95 text-text-primary inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-lg shadow-black/5 backdrop-blur">
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full",
          accent
            ? "bg-accent-500/10 text-accent-600"
            : "bg-brand-500/10 text-brand-600",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      {label}
    </span>
  );
}

export function HeroMarketplacePreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[35rem]">
      {/* Soft decorative glows */}
      <div
        aria-hidden="true"
        className="from-brand-500/10 via-accent-500/5 pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-linear-to-br to-transparent blur-2xl"
      />
      <div
        aria-hidden="true"
        className="bg-accent-500/10 pointer-events-none absolute -top-10 -right-6 -z-10 h-40 w-40 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-brand-500/10 pointer-events-none absolute -bottom-10 -left-6 -z-10 h-44 w-44 rounded-full blur-3xl"
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
        className="border-border bg-surface/85 relative rounded-[2rem] border p-2.5 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-3.5 dark:shadow-black/30"
      >
        <div className="flex items-center justify-between gap-3 px-2.5 pt-1 pb-2.5">
          <span className="text-text-tertiary inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase">
            <Sparkles className="text-brand-600 h-3.5 w-3.5" />
            Marketplace preview
          </span>
          <span className="border-border bg-surface-muted text-text-secondary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium">
            <span className="bg-status-active h-1.5 w-1.5 rounded-full" />
            Sample
          </span>
        </div>

        <div className="border-border bg-surface-muted relative overflow-hidden rounded-[1.5rem] border p-3 sm:p-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative space-y-3">
            <TalentPreviewCard />

            <div className="flex items-center gap-2 px-1">
              <div className="bg-border h-px flex-1" />
              <span className="border-brand-500/20 bg-brand-500/5 text-brand-600 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold">
                <Sparkles className="h-3 w-3" />
                Strong skill match
              </span>
              <div className="bg-border h-px flex-1" />
            </div>

            <ProjectPreviewCard />
          </div>
        </div>

        <p className="text-text-tertiary px-3 pt-2.5 pb-1 text-center text-[10px]">
          Illustrative preview — sample profiles and projects, not live data.
        </p>
      </motion.div>

      {/* Floating skill chips on large screens */}
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 left-8 hidden xl:block"
      >
        <SkillChip icon={PenTool} label="Figma" accent />
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        className="absolute right-8 -bottom-10 hidden xl:block"
      >
        <SkillChip icon={Code2} label="React" />
      </motion.div>

      {/* Compact chip row on smaller screens */}
      <div className="mt-3 flex flex-wrap justify-center gap-2 xl:hidden">
        <SkillChip icon={PenTool} label="Figma" accent />
        <SkillChip icon={Code2} label="React" />
        <SkillChip icon={Layers3} label="Design systems" />
      </div>
    </div>
  );
}
