"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Code2,
  FileSearch,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const freelancerSkills = ["React", "TypeScript", "Node.js"];
const jobSkills = ["React", "TypeScript", "REST APIs"];

const features = [
  {
    icon: FileSearch,
    title: "Relevant opportunities",
    description: "Explore jobs that fit your skill set.",
  },
  {
    icon: Code2,
    title: "Clear skill comparison",
    description: "See which requirements overlap.",
  },
  {
    icon: UserRound,
    title: "Talent discovery",
    description: "Help clients find suitable freelancers.",
  },
];

export function AiMatchingShowcase() {
  return (
    <section className="border-border bg-surface-muted/50 border-y">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* Compact section heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-brand-600 border-brand-500/20 bg-brand-500/5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Skill-focused matching
          </div>

          <h2 className="text-text-primary mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Find the right fit.{" "}
            <span className="text-brand-600">Both ways.</span>
          </h2>

          <p className="text-text-secondary mx-auto mt-3 max-w-xl text-sm leading-6 sm:text-base">
            Nexora brings job requirements and freelancer skills together,
            helping both sides make more informed connections.
          </p>
        </motion.div>

        {/* Horizontal matching visualization */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="border-border bg-surface mx-auto mt-9 max-w-4xl rounded-2xl border p-4 shadow-sm sm:p-6"
        >
          <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-5">
            {/* Freelancer card */}
            <div className="border-border rounded-xl border p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="bg-brand-500/10 text-brand-600 flex h-10 w-10 items-center justify-center rounded-lg">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-text-secondary text-xs">
                    Freelancer profile
                  </p>
                  <h3 className="text-text-primary mt-0.5 text-sm font-semibold">
                    Frontend Developer
                  </h3>
                </div>
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

            {/* Matching connector */}
            <div className="flex items-center justify-center gap-3 py-1 md:flex-col md:py-0">
              <div className="bg-border h-px flex-1 md:h-6 md:w-px md:flex-none" />

              <div className="border-brand-500/20 bg-brand-500/5 text-brand-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                <Code2 className="h-4 w-4" />
              </div>

              <div className="bg-border h-px flex-1 md:h-6 md:w-px md:flex-none" />
            </div>

            {/* Job card */}
            <div className="border-border rounded-xl border p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="bg-surface-muted text-text-secondary flex h-10 w-10 items-center justify-center rounded-lg">
                  <FileSearch className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-text-secondary text-xs">
                    Job requirements
                  </p>
                  <h3 className="text-text-primary mt-0.5 text-sm font-semibold">
                    Frontend Engineer
                  </h3>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {jobSkills.map((skill) => {
                  const shared = freelancerSkills.includes(skill);

                  return (
                    <span
                      key={skill}
                      className={
                        shared
                          ? "bg-status-active/10 text-status-active rounded-md px-2.5 py-1.5 text-xs"
                          : "bg-surface-muted text-text-secondary rounded-md px-2.5 py-1.5 text-xs"
                      }
                    >
                      {shared && <Check className="mr-1 inline h-3 w-3" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shared skill explanation */}
          <div className="bg-status-active/10 mt-4 flex flex-col gap-3 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-status-active/15 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                <Check className="text-status-active h-4 w-4" />
              </div>

              <div>
                <p className="text-text-primary text-sm font-semibold">
                  Shared skills identified
                </p>
                <p className="text-text-secondary mt-0.5 text-xs leading-5">
                  React and TypeScript appear in both examples.
                </p>
              </div>
            </div>

            <span className="text-text-secondary text-[11px] sm:text-right">
              Illustrative example
            </span>
          </div>
        </motion.div>

        {/* Three compact benefits */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-3 sm:gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="bg-brand-500/10 text-brand-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-text-primary text-sm font-semibold">
                  {title}
                </h3>
                <p className="text-text-secondary mt-1 text-xs leading-5">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Small footer link */}
        <div className="mt-7 text-center">
          <Link
            href="/jobs"
            className="text-brand-600 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
          >
            Explore opportunities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-text-secondary mt-4 text-center text-[11px]">
          Sample profiles and skills only. Live AI matching is not connected.
        </p>
      </div>
    </section>
  );
}
