"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MatchPreviewCard } from "@/components/shared/match-preview-card";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Subtle background accents */}
      <div
        aria-hidden="true"
        className="bg-brand-500/5 pointer-events-none absolute -top-32 right-0 -z-10 h-96 w-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-brand-500/5 pointer-events-none absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
        {/* Hero content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="max-w-2xl"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400 mb-7 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />A smarter way to freelance
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-text-primary text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Freelance work,
            <span className="text-brand-600 block">
              matched to your skills.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-text-secondary mt-6 max-w-xl text-base leading-7 sm:text-lg sm:leading-8"
          >
            Discover opportunities that fit your expertise, showcase your work,
            and connect with clients. Nexora brings job discovery and the
            freelance hiring journey together in one place.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/register?role=freelancer" className="inline-flex">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                Find work
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/register?role=client" className="inline-flex">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Hire talent
              </Button>
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-text-secondary mt-5 text-sm"
          >
            Built for freelancers and the clients looking for them.
          </motion.p>
        </motion.div>

        {/* Matching product preview */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto"
        >
          <div
            aria-hidden="true"
            className="border-brand-500/10 bg-brand-500/3 absolute -inset-4 -z-10 rounded-4xl border sm:-inset-6"
          />

          <MatchPreviewCard />
        </motion.div>
      </div>
    </section>
  );
}
