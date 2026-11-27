"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UsersRound,
  Waypoints,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const trustSignals = [
  { icon: Sparkles, label: "Skill-first matching" },
  { icon: ShieldCheck, label: "Structured contracts" },
  { icon: Star, label: "Two-way reviews" },
] as const;

const signalItems = [
  {
    icon: Target,
    step: "01",
    title: "Skills before keywords",
    description:
      "Compare what a project needs with what a freelancer actually does.",
  },
  {
    icon: Waypoints,
    step: "02",
    title: "One shared thread",
    description: "Scope, status, and the next step stay visible to both sides.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Trust that compounds",
    description:
      "Contracts, payments, and reviews follow the work through delivery.",
  },
] as const;

export function AboutHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="border-border bg-surface relative isolate overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="from-brand-500/5 pointer-events-none absolute inset-0 -z-10 bg-linear-to-b via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="bg-brand-500/10 pointer-events-none absolute -top-32 left-1/3 -z-10 h-80 w-[42rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-accent-500/10 pointer-events-none absolute top-20 right-0 -z-10 h-64 w-64 rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-20">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto w-full max-w-2xl min-w-0 text-center lg:mx-0 lg:text-left"
          >
            <div className="border-brand-500/20 bg-brand-500/5 text-brand-600 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium sm:text-sm">
              <Sparkles className="h-4 w-4" />
              About Nexora
            </div>

            <h1 className="text-text-primary mt-6 text-4xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-[clamp(3.25rem,4.5vw,4.5rem)]">
              Freelance work,
              <span className="text-brand-600 block">
                with fewer blind spots.
              </span>
            </h1>

            <p className="text-text-secondary mx-auto mt-6 max-w-xl text-base leading-7 text-pretty sm:text-lg sm:leading-8 lg:mx-0">
              Nexora is a marketplace built around a shared view of skills,
              scope, and expectations&mdash;so the right people can find each
              other and move work forward with confidence.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/jobs"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group shadow-brand-950/10 h-12 gap-2 px-6 text-sm font-semibold shadow-lg sm:text-base dark:shadow-black/30",
                )}
              >
                Explore projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/freelancers"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-12 gap-2 px-6 text-sm font-semibold sm:text-base",
                )}
              >
                <UsersRound className="h-4 w-4" />
                Meet the talent
              </Link>
            </div>

            <div className="border-border mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 border-t pt-6 lg:justify-start">
              {trustSignals.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="text-text-secondary inline-flex items-center gap-2 text-xs font-medium sm:text-sm"
                >
                  <Icon className="text-brand-600 h-4 w-4" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md min-w-0"
          >
            <div
              aria-hidden="true"
              className="bg-brand-500/10 absolute -inset-5 rounded-[2rem] blur-2xl"
            />

            <div className="border-border bg-surface shadow-brand-950/10 relative overflow-hidden rounded-3xl border p-4 shadow-xl sm:p-5 dark:shadow-black/25">
              <div className="from-brand-500/10 pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b to-transparent" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-text-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
                    The Nexora signal
                  </p>
                  <h2 className="text-text-primary mt-2 text-lg font-semibold sm:text-xl">
                    Clarity at every step
                  </h2>
                </div>

                <span className="bg-brand-500/10 text-brand-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </span>
              </div>

              <div className="relative mt-5 space-y-3">
                {signalItems.map(
                  ({ icon: Icon, step, title, description }, index) => (
                    <motion.div
                      key={step}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 10 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.24 + index * 0.08,
                        ease: "easeOut",
                      }}
                      className="border-border bg-surface-muted/60 flex gap-3 rounded-2xl border p-3.5"
                    >
                      <span className="bg-surface text-brand-600 border-border flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border">
                        <Icon className="h-4 w-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-text-primary text-sm font-semibold">
                            {title}
                          </p>
                          <span className="text-text-tertiary text-[10px] font-semibold tracking-widest">
                            {step}
                          </span>
                        </div>
                        <p className="text-text-secondary mt-1 text-xs leading-5">
                          {description}
                        </p>
                      </div>
                    </motion.div>
                  ),
                )}
              </div>

              <div className="bg-brand-solid relative mt-4 flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-white">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                    The standard
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Relevant. Structured. Accountable.
                  </p>
                </div>
                <BriefcaseBusiness className="h-5 w-5 shrink-0 text-white/70" />
              </div>

              <p className="text-text-tertiary mt-3 text-center text-[11px]">
                An illustrative view of the Nexora experience.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
