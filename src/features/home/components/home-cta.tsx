"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, UsersRound } from "lucide-react";

export function HomeCta() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="bg-text-primary relative isolate overflow-hidden rounded-3xl px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16 dark:bg-[#192338]"
        >
          {/* Decorative background elements */}
          <div className="bg-brand-500/20 pointer-events-none absolute -top-24 right-0 -z-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80">
                <Sparkles className="text-brand-400 h-4 w-4" />
                Your next opportunity starts here
              </div>

              <h2 className="mt-6 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Great work starts with the right connection.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                Find opportunities that fit your skills or connect with talented
                professionals to bring your next big idea to life.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/register"
                className="bg-brand-500/80 hover:bg-brand-500 flex items-center justify-center rounded-lg p-4 text-white"
              >
                <p>Join Nexora</p>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/jobs"
                className="flex items-center rounded-lg border-white/20 bg-white/5 p-4 text-white hover:bg-white/10 hover:text-white"
              >
                <UsersRound className="mr-2 h-4 w-4" />
                Explore opportunities
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6">
            <p className="text-sm text-white/50">
              Built for freelancers, clients, and ambitious ideas.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
