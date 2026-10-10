"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Search,
    label: "Find relevant work",
  },
  {
    icon: UsersRound,
    label: "Discover skilled talent",
  },
  {
    icon: ShieldCheck,
    label: "Work with confidence",
  },
];

const skills = [
  {
    label: "React",
    icon: Code2,
    position: "left-2 top-4 sm:left-4 sm:top-8",
  },
  {
    label: "TypeScript",
    icon: Code2,
    position: "right-2 top-4 sm:right-4 sm:top-8",
  },
  {
    label: "UI/UX Design",
    icon: Sparkles,
    position: "bottom-2 left-1/2 -translate-x-1/2",
  },
];

export function HomeHero() {
  return (
    <section className="border-border relative isolate overflow-hidden border-b">
      {/* Soft background accents */}
      <div
        aria-hidden="true"
        className="from-brand-500/4 to-brand-500/3 pointer-events-none absolute inset-0 -z-10 bg-linear-to-b via-transparent"
      />
      <div
        aria-hidden="true"
        className="bg-brand-500/8 pointer-events-none absolute top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left: Main hero content */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-center lg:text-left"
          >
            <div className="border-brand-500/20 bg-brand-500/5 text-brand-600 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium sm:text-sm">
              <Sparkles className="h-4 w-4" />A smarter way to freelance
            </div>

            <h1 className="text-text-primary mt-6 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Freelance work,
              <span className="text-brand-600 block">
                matched to your skills.
              </span>
            </h1>

            <p className="text-text-secondary mt-5 text-sm leading-6 sm:text-base sm:leading-7">
              Discover opportunities that fit your expertise, showcase your
              work, and connect with clients. Nexora brings job discovery and
              freelance hiring together in one place.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/register?role=freelancer">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Find work
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/register?role=client">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full gap-2 sm:w-auto"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  Hire talent
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Decorative skill composition */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative mx-auto h-44 w-full max-w-md sm:h-52 lg:h-72 lg:max-w-none"
          >
            <div
              aria-hidden="true"
              className="from-brand-500/10 via-brand-500/3 absolute inset-4 rounded-4xl bg-linear-to-br to-transparent"
            />

            <div
              aria-hidden="true"
              className="border-brand-500/15 absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-48 sm:w-48 lg:h-56 lg:w-56"
            />

            <div
              aria-hidden="true"
              className="border-brand-500/20 absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-32 sm:w-32"
            />

            {skills.map(({ label, icon: Icon, position }, index) => (
              <motion.div
                key={label}
                animate={{ y: [0, index === 1 ? -5 : 5, 0] }}
                transition={{
                  duration: 3 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`border-border bg-surface text-text-primary absolute ${position} inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-sm sm:px-4 sm:text-sm`}
              >
                <span className="bg-brand-500/10 text-brand-600 flex h-7 w-7 items-center justify-center rounded-full">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom: Value propositions */}
        <div className="border-border mx-auto mt-10 grid max-w-4xl gap-4 border-t pt-6 sm:grid-cols-3 sm:gap-3 lg:mt-12">
          {highlights.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2.5"
            >
              <span className="bg-brand-500/10 text-brand-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-text-secondary text-xs font-medium sm:text-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
