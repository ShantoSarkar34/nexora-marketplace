"use client";

import { Check, Minus, Quote, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { AboutReveal } from "./about-reveal";
import { AboutSectionHeading } from "./about-section-heading";

const beforeNexora = [
  "Endless listings with little signal",
  "Fit discovered after the first message",
  "Scope and payment surprises late in the project",
];

const withNexora = [
  "Requirements and strengths easy to compare",
  "A shared lifecycle from shortlist to delivery",
  "Contracts, payments, and reviews in one thread",
];

const sharedSignals = [
  { label: "Skills", detail: "What the work needs" },
  { label: "Scope", detail: "What both sides agree" },
  { label: "Delivery", detail: "What happens next" },
];

function ContrastCard({
  tone,
  title,
  items,
}: {
  tone: "before" | "after";
  title: string;
  items: string[];
}) {
  const isAfter = tone === "after";
  const Icon = isAfter ? Check : X;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isAfter
          ? "border-brand-500/25 bg-brand-500/5"
          : "border-border bg-surface-muted/60",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isAfter
              ? "bg-brand-500/10 text-brand-600"
              : "bg-status-error/10 text-status-error",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-text-primary text-sm font-semibold">{title}</p>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="text-text-secondary flex gap-2.5 text-sm leading-6"
          >
            <Minus
              className={cn(
                "mt-1.5 h-3.5 w-3.5 shrink-0",
                isAfter ? "text-brand-600" : "text-text-tertiary",
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutStory() {
  return (
    <section className="border-border bg-surface border-b py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-20">
          <AboutReveal>
            <AboutSectionHeading
              eyebrow="Why Nexora exists"
              title={
                <>
                  Most marketplaces optimize for activity.{" "}
                  <span className="text-brand-600">We optimize for fit.</span>
                </>
              }
              description="Freelancers should not have to guess whether a project is worth their time. Clients should not have to guess whether a profile matches the work. Nexora starts by making the important signals visible."
            />

            <p className="text-text-secondary mt-5 max-w-xl text-sm leading-7 sm:text-base">
              The result is a calmer marketplace: fewer cold starts, clearer
              conversations, and a shared record of what was agreed.
            </p>

            <div className="border-brand-500/20 bg-brand-500/5 mt-7 rounded-2xl border p-5">
              <Quote className="text-brand-600 h-5 w-5" />
              <p className="text-text-primary mt-3 text-base leading-7 font-medium">
                &ldquo;A good marketplace should make the next step easier to
                see.&rdquo;
              </p>
              <p className="text-text-tertiary mt-2 text-[10px] font-semibold tracking-[0.16em] uppercase">
                The Nexora point of view
              </p>
            </div>
          </AboutReveal>

          <AboutReveal delay={0.12}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="bg-brand-500/5 pointer-events-none absolute -inset-4 rounded-3xl blur-2xl"
              />

              <div className="relative grid gap-4 sm:grid-cols-2">
                <ContrastCard
                  tone="before"
                  title="Without a shared signal"
                  items={beforeNexora}
                />
                <ContrastCard
                  tone="after"
                  title="With Nexora"
                  items={withNexora}
                />
              </div>

              <div className="border-border bg-surface-muted/60 relative mt-4 rounded-2xl border p-5">
                <p className="text-text-tertiary text-[10px] font-semibold tracking-[0.16em] uppercase">
                  The shared thread
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {sharedSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="border-border bg-surface rounded-xl border px-3 py-3 text-center"
                    >
                      <p className="text-text-primary text-sm font-semibold">
                        {signal.label}
                      </p>
                      <p className="text-text-tertiary mt-1 text-[10px] leading-4">
                        {signal.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-text-secondary mt-4 text-sm leading-6">
                  When both sides can see the same signals, the work moves with
                  less friction.
                </p>
              </div>
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  );
}
