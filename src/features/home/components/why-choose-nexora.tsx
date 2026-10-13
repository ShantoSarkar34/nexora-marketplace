"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  ShieldCheck,
  UsersRound,
  ArrowUpRight,
} from "lucide-react";

const benefits = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "Smarter Talent Discovery",
    description:
      "Find relevant opportunities and explore freelancers based on their skills, experience, and project needs.",
    accent: "bg-brand-500/10 text-brand-600",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "A Structured Workflow",
    description:
      "Manage applications, contracts, and project payments through one organized platform.",
    accent: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: UsersRound,
    number: "03",
    title: "Built for Both Sides",
    description:
      "Whether you're hiring talent or searching for your next opportunity, Nexora brings both sides together.",
    accent: "bg-violet-500/10 text-violet-600",
  },
];

export function WhyChooseNexora() {
  return (
    <section className="border-border bg-surface-muted border-y py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-brand-600 text-sm font-semibold tracking-widest">
            WHY NEXORA
          </span>

          <h2 className="text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Freelancing, with a clearer direction.
          </h2>

          <p className="text-text-secondary mt-4 text-base leading-7 sm:text-lg">
            Everything you need to connect, collaborate, and move projects
            forward with confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.article
                key={benefit.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="group border-border bg-surface hover:border-brand-500/40 relative overflow-hidden rounded-2xl border p-6 transition-colors sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${benefit.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="text-text-secondary/50 text-sm font-medium">
                    {benefit.number}
                  </span>
                </div>

                <h3 className="text-text-primary mt-7 text-xl font-semibold">
                  {benefit.title}
                </h3>

                <p className="text-text-secondary mt-3 text-sm leading-7">
                  {benefit.description}
                </p>

                <div className="text-brand-600 mt-6 flex items-center gap-2 text-sm font-medium">
                  Explore Nexora
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
