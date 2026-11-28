"use client";

import Link from "next/link";
import { ArrowRight, Building2, Check, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { AboutReveal } from "./about-reveal";
import { AboutSectionHeading } from "./about-section-heading";

const audiences = [
  {
    icon: UserRound,
    label: "For freelancers",
    title: "Find work that respects your time.",
    description:
      "Show how you work, see where your skills fit, and keep the whole engagement in one place.",
    points: [
      "Build a profile that shows how you work, not just what you list.",
      "Find projects with a visible skill and scope match.",
      "Keep applications, contracts, and conversations together.",
      "Build a review history that follows completed work.",
    ],
    cta: "Find your next project",
    href: "/jobs",
    accent: "bg-freelancer-500/10 text-freelancer-500",
    border: "border-freelancer-500/20",
    glow: "bg-freelancer-500/5",
    button:
      "hover:border-freelancer-500/40 hover:bg-freelancer-500/5 hover:text-freelancer-500",
  },
  {
    icon: Building2,
    label: "For clients",
    title: "Hire with a clearer view of fit.",
    description:
      "Describe the work once, compare relevant talent, and keep the project moving from agreement to delivery.",
    points: [
      "Describe the work once and make requirements easy to compare.",
      "Review relevant talent before starting a conversation.",
      "Agree on scope and track progress in one place.",
      "Approve delivery and leave a verified review.",
    ],
    cta: "Meet available talent",
    href: "/freelancers",
    accent: "bg-client-500/10 text-client-500",
    border: "border-client-500/20",
    glow: "bg-client-500/5",
    button:
      "hover:border-client-500/40 hover:bg-client-500/5 hover:text-client-500",
  },
] as const;

export function AboutAudiences() {
  return (
    <section className="border-border bg-surface-muted border-b py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AboutReveal>
          <AboutSectionHeading
            align="center"
            eyebrow="Built for both sides"
            title={
              <>
                Different starting points.{" "}
                <span className="text-brand-600">The same shared standard.</span>
              </>
            }
            description="A marketplace only works when both sides can see what the other sees. Nexora is designed for that shared view."
          />
        </AboutReveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;

            return (
              <AboutReveal
                key={audience.label}
                delay={index * 0.08}
                className="h-full"
              >
                <article
                  className={cn(
                    "group bg-surface relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 sm:p-8",
                    audience.border,
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl",
                      audience.glow,
                    )}
                  />

                  <div className="relative flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        audience.accent,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-text-tertiary text-[10px] font-semibold tracking-[0.18em] uppercase">
                      {audience.label}
                    </p>
                  </div>

                  <h3 className="text-text-primary relative mt-6 max-w-md text-2xl font-semibold tracking-[-0.03em] text-balance sm:text-3xl">
                    {audience.title}
                  </h3>
                  <p className="text-text-secondary relative mt-3 max-w-lg text-sm leading-7 sm:text-base">
                    {audience.description}
                  </p>

                  <ul className="relative mt-6 space-y-3">
                    {audience.points.map((point) => (
                      <li
                        key={point}
                        className="text-text-secondary flex gap-3 text-sm leading-6"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            audience.accent,
                          )}
                        >
                          <Check className="h-3 w-3 " />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-8 pt-2 ">
                    <Link
                      href={audience.href}
                      className={cn(
                        buttonVariants({ variant: "secondary", size: "md" }),
                        "group/cta w-full justify-between sm:w-auto",
                        audience.button,
                      )}
                    >
                      {audience.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              </AboutReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
