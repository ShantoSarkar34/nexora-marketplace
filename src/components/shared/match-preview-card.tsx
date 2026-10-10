"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Sparkles,
  UserRound,
} from "lucide-react";

const freelancerSkills = ["React", "TypeScript", "Node.js"];
const jobSkills = ["React", "TypeScript", "REST APIs"];

export function MatchPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xl shadow-black/4"
    >
      {/* Preview header */}
      <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-500/10 text-brand-600 flex h-9 w-9 items-center justify-center rounded-xl">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-text-primary text-sm font-semibold">
              Skill match preview
            </p>
            <p className="text-text-secondary text-xs">
              Explore how matching could look
            </p>
          </div>
        </div>

        <span className="border-border text-text-secondary rounded-full border px-2.5 py-1 text-[10px] font-medium sm:text-xs">
          Demo
        </span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* Demo score */}
        <div className="bg-surface-muted rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="border-brand-500/20 relative flex h-19 w-19 shrink-0 items-center justify-center rounded-full border-[5px]">
              <div className="text-center">
                <p className="text-text-primary text-xl font-bold">94%</p>
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
                <Sparkles className="text-brand-600 h-4 w-4" />
                Illustrative match score
              </p>
              <p className="text-text-secondary mt-1 text-xs leading-5">
                Sample data only. This is not a real AI-generated result.
              </p>
            </div>
          </div>
        </div>

        {/* Freelancer */}
        <div className="border-border rounded-xl border p-4">
          <div className="flex items-start gap-3">
            <div className="bg-brand-500/10 text-brand-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-text-secondary text-xs">Sample freelancer</p>
              <h3 className="text-text-primary mt-0.5 font-semibold">
                Frontend Developer
              </h3>
              <p className="text-text-secondary mt-1 text-xs">
                Illustrative profile
              </p>
            </div>

            <ArrowUpRight className="text-text-secondary h-4 w-4 shrink-0" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {freelancerSkills.map((skill) => (
              <span
                key={skill}
                className="bg-surface-muted text-text-secondary rounded-md px-2.5 py-1.5 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Job */}
        <div className="border-border rounded-xl border p-4">
          <div className="flex items-start gap-3">
            <div className="bg-surface-muted text-text-secondary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-text-secondary text-xs">Sample opportunity</p>
              <h3 className="text-text-primary mt-0.5 font-semibold">
                Frontend Engineer
              </h3>
              <p className="text-text-secondary mt-1 text-xs">
                Illustrative job requirements
              </p>
            </div>

            <Code2 className="text-text-secondary h-4 w-4 shrink-0" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {jobSkills.map((skill) => (
              <span
                key={skill}
                className="bg-surface-muted text-text-secondary rounded-md px-2.5 py-1.5 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Shared skills */}
        <div className="bg-status-active/10 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="bg-status-active/15 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
              <Check className="text-status-active h-4 w-4" />
            </div>

            <div>
              <p className="text-text-primary text-sm font-semibold">
                Shared skills
              </p>
              <p className="text-text-secondary mt-0.5 text-xs">
                React · TypeScript
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-border bg-surface-muted/50 border-t px-5 py-3 sm:px-6">
        <p className="text-text-secondary text-center text-[11px] leading-5">
          Illustrative UI preview — matching logic is not connected.
        </p>
      </div>
    </motion.div>
  );
}
