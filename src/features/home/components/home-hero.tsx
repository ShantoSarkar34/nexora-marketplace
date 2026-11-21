"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { HeroMarketplacePreview } from "./hero-marketplace-preview";

const trustSignals = [
  { icon: Sparkles, label: "AI-assisted matching" },
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Star, label: "Two-way reviews" },
] as const;

export function HomeHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="border-border bg-surface relative isolate overflow-hidden border-b">
      {/* Soft background accents */}
      <div
        aria-hidden="true"
        className="from-brand-500/5 pointer-events-none absolute inset-0 -z-10 bg-linear-to-b via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="bg-brand-500/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-accent-500/10 pointer-events-none absolute top-24 right-0 -z-10 h-72 w-72 rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 xl:gap-16">
          {/* Left: Hero message and actions */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto w-full max-w-2xl min-w-0 text-center lg:mx-0 lg:text-left"
          >
            <div className="border-brand-500/20 bg-brand-500/5 text-brand-600 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium sm:text-sm">
              <Sparkles className="h-4 w-4" />
              AI-assisted matching for modern teams
            </div>

            <h1 className="text-text-primary mt-6 text-[clamp(1.5rem,7.5vw,2.35rem)] leading-[1.06] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[clamp(2.75rem,4.3vw,3.5rem)] xl:text-[3.5rem] 2xl:text-[4rem]">
              Find the <span className="text-brand-600">right talent.</span>
              <span className="mt-1 block">Build something great.</span>
            </h1>

            <p className="text-text-secondary mx-auto mt-6 max-w-xl text-base leading-7 text-pretty sm:text-lg sm:leading-8 lg:mx-0">
              Nexora connects ambitious clients with skilled freelancers through
              AI-assisted matching, secure payments, and a shared workspace
              built for real collaboration—from first brief to final delivery.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/freelancers"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group shadow-brand-950/10 h-12 gap-2 px-6 text-sm font-semibold shadow-lg sm:text-base dark:shadow-black/30",
                )}
              >
                Explore talent
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/jobs"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-12 gap-2 px-6 text-sm font-semibold sm:text-base",
                )}
              >
                <BriefcaseBusiness className="h-4 w-4" />
                Browse projects
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

          {/* Right: Marketplace preview composition */}
          <div className="relative min-w-0">
            <HeroMarketplacePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
