"use client";

import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { AboutReveal } from "./about-reveal";
import { AboutSectionHeading } from "./about-section-heading";

const lifecycleSteps = [
  {
    icon: Search,
    step: "01",
    title: "Discover",
    description:
      "Explore projects or talent with enough context to decide whether to look closer.",
    accent: "bg-brand-500/10 text-brand-600",
  },
  {
    icon: Target,
    step: "02",
    title: "Match",
    description:
      "Compare skills, scope, and budget before the first message is sent.",
    accent: "bg-accent-500/10 text-accent-600",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Collaborate",
    description:
      "Keep applications, contracts, and conversations in one organized place.",
    accent: "bg-freelancer-500/10 text-freelancer-500",
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Deliver",
    description:
      "Approve work, complete payment, and turn the result into a verified review.",
    accent: "bg-client-500/10 text-client-500",
  },
] as const;

export function AboutLifecycle() {
  return (
    <section className="border-border bg-surface border-b py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <AboutReveal>
            <AboutSectionHeading
              eyebrow="One shared lifecycle"
              title={
                <>
                  From first look to final delivery,{" "}
                  <span className="text-brand-600">one thread.</span>
                </>
              }
              description="Nexora is designed around the moments where projects usually lose momentum: the first comparison, the first agreement, and the final handoff."
            />
          </AboutReveal>

          <AboutReveal delay={0.1}>
            <Link
              href="/jobs"
              className="text-brand-600 hover:text-brand-700 group inline-flex items-center gap-2 text-sm font-semibold"
            >
              See open projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </AboutReveal>
        </div>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="border-border absolute top-5 right-[12.5%] left-[12.5%] hidden border-t border-dashed lg:block"
          />

          <div className="grid gap-4 lg:grid-cols-4">
            {lifecycleSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <AboutReveal
                  key={step.step}
                  delay={index * 0.07}
                  className="h-full"
                >
                  <article className="border-border bg-surface relative flex h-full flex-col rounded-2xl border p-5">
                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "border-border bg-surface flex h-10 w-10 items-center justify-center rounded-full border",
                          step.accent,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-brand-600 text-[10px] font-semibold tracking-[0.18em]">
                        STEP {step.step}
                      </span>
                    </div>

                    <h3 className="text-text-primary mt-6 text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary mt-2 text-sm leading-6">
                      {step.description}
                    </p>
                  </article>
                </AboutReveal>
              );
            })}
          </div>
        </div>

        <AboutReveal delay={0.14}>
          <div className="border-brand-500/20 bg-brand-500/5 mt-4 flex flex-col gap-4 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-brand-500/10 text-brand-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <UsersRound className="h-5 w-5" />
              </span>
              <div>
                <p className="text-text-primary text-sm font-semibold">
                  Both sides see the same status.
                </p>
                <p className="text-text-secondary mt-0.5 text-xs leading-5">
                  That shared view is what keeps a project moving.
                </p>
              </div>
            </div>

            <p className="text-text-tertiary max-w-xs text-xs leading-5 sm:text-right">
              A visible lifecycle turns a one-off transaction into a
              relationship built on proof.
            </p>
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}
