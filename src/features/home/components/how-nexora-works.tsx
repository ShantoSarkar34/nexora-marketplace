"use client";

import { motion } from "framer-motion";
import {
  UserRoundPlus,
  Search,
  Handshake,
  Rocket,
  ArrowRight,
} from "lucide-react";

const freelancerSteps = [
  {
    icon: UserRoundPlus,
    title: "Build your profile",
    description:
      "Showcase your skills, experience, and portfolio to help clients understand what you bring to the table.",
  },
  {
    icon: Search,
    title: "Discover opportunities",
    description:
      "Explore available projects and find work that aligns with your skills and interests.",
  },
  {
    icon: Handshake,
    title: "Apply and connect",
    description:
      "Submit applications, connect with clients, and discuss project expectations.",
  },
  {
    icon: Rocket,
    title: "Deliver and grow",
    description:
      "Manage your contracts, complete projects, and build your professional reputation.",
  },
];

const clientSteps = [
  {
    icon: UserRoundPlus,
    title: "Create your account",
    description:
      "Set up your client profile and get ready to find professionals for your project.",
  },
  {
    icon: Search,
    title: "Post a project",
    description:
      "Describe your requirements, desired skills, and budget so freelancers can understand your needs.",
  },
  {
    icon: Handshake,
    title: "Review and hire",
    description:
      "Explore applications, compare candidates, and choose the right freelancer for your project.",
  },
  {
    icon: Rocket,
    title: "Manage your project",
    description:
      "Coordinate work through contracts, track progress, and handle project payments.",
  },
];

function StepList({
  title,
  description,
  steps,
  accent,
}: {
  title: string;
  description: string;
  steps: typeof freelancerSteps;
  accent: string;
}) {
  return (
    <div className="border-border bg-surface rounded-2xl border p-6 sm:p-8">
      <div className="mb-8">
        <span className={`text-sm font-semibold ${accent}`}>{title}</span>
        <p className="text-text-secondary mt-2 text-sm leading-6">
          {description}
        </p>
      </div>

      <div className="space-y-7">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex gap-4"
            >
              <div className="flex shrink-0 flex-col items-center">
                <div className="bg-surface-muted border-border flex h-11 w-11 items-center justify-center rounded-xl border">
                  <Icon className={`h-5 w-5 ${accent}`} />
                </div>

                {index !== steps.length - 1 && (
                  <div className="bg-border mt-3 min-h-6 w-px flex-1" />
                )}
              </div>

              <div className="pb-2">
                <span className="text-text-secondary text-xs">
                  STEP {index + 1}
                </span>
                <h3 className="text-text-primary mt-1 font-semibold">
                  {step.title}
                </h3>
                <p className="text-text-secondary mt-2 text-sm leading-6">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function HowNexoraWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-brand-600 text-sm font-semibold tracking-widest">
            SIMPLE BY DESIGN
          </span>

          <h2 className="text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            From first step to finished project.
          </h2>

          <p className="text-text-secondary mt-4 text-base leading-7 sm:text-lg">
            A straightforward process for freelancers finding work and clients
            building their teams.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-2">
          <StepList
            title="FOR FREELANCERS"
            description="Turn your skills into meaningful opportunities."
            steps={freelancerSteps}
            accent="text-freelancer-500"
          />

          <StepList
            title="FOR CLIENTS"
            description="Move from project idea to the right hire."
            steps={clientSteps}
            accent="text-client-500"
          />
        </div>

        <div className="text-text-secondary mt-8 flex items-center justify-center gap-2 text-sm">
          One platform. Two sides. More ways to move forward.
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </section>
  );
}
