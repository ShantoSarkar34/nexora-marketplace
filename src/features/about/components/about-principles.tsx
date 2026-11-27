"use client";

import { Compass, ShieldCheck, Target, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";

import { AboutReveal } from "./about-reveal";
import { AboutSectionHeading } from "./about-section-heading";

const principles = [
  {
    icon: Compass,
    number: "01",
    title: "Clarity over noise",
    description:
      "Every surface should answer a practical question: what does this project need, what does this person do, and does it fit?",
    signal: "Visible in matching",
    accent: "bg-brand-500/10 text-brand-600",
    hover: "hover:border-brand-500/30",
  },
  {
    icon: Target,
    number: "02",
    title: "Fit over volume",
    description:
      "A smaller set of relevant opportunities is more useful than a crowded feed. We design for signal, not endless scroll.",
    signal: "Visible in discovery",
    accent: "bg-accent-500/10 text-accent-600",
    hover: "hover:border-accent-500/30",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Trust through structure",
    description:
      "Contracts, payments, and reviews should follow a visible path. Both sides should know what has been agreed and what comes next.",
    signal: "Visible in contracts",
    accent: "bg-freelancer-500/10 text-freelancer-500",
    hover: "hover:border-freelancer-500/30",
  },
  {
    icon: UsersRound,
    number: "04",
    title: "Built for both sides",
    description:
      "Freelancers and clients see the same shared expectations. A marketplace works when neither side has to guess what the other sees.",
    signal: "Visible in reviews",
    accent: "bg-client-500/10 text-client-500",
    hover: "hover:border-client-500/30",
  },
] as const;

export function AboutPrinciples() {
  return (
    <section className="border-border bg-surface-muted border-b py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AboutReveal>
          <AboutSectionHeading
            align="center"
            eyebrow="What we optimize for"
            title={
              <>
                Four principles behind every{" "}
                <span className="text-brand-600">Nexora decision.</span>
              </>
            }
            description="A marketplace is a set of small decisions made at scale. These are the decisions we keep coming back to."
          />
        </AboutReveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((principle, index) => {
            const Icon = principle.icon;

            return (
              <AboutReveal
                key={principle.number}
                delay={index * 0.06}
                className="h-full"
              >
                <article
                  className={cn(
                    "group border-border bg-surface hover:shadow-brand-950/5 relative flex h-full flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/20",
                    principle.hover,
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        principle.accent,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-text-tertiary text-[10px] font-semibold tracking-[0.18em]">
                      {principle.number}
                    </span>
                  </div>

                  <h3 className="text-text-primary mt-6 text-lg font-semibold tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="text-text-secondary mt-2 text-sm leading-6">
                    {principle.description}
                  </p>

                  <p className="text-text-tertiary border-border mt-auto border-t pt-4 text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {principle.signal}
                  </p>
                </article>
              </AboutReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
