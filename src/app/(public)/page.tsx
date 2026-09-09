"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MatchPreviewCard } from "@/components/shared/match-preview-card";
import { CountUp } from "@/components/shared/count-up";
import { JobCard } from "@/features/jobs/components/job-card";
import { jobCategoryLabels } from "@/types/enums";
import { useJobs } from "@/hooks/use-jobs";

const freelancerSteps = [
  "Build a profile with real skills and portfolio work",
  "Browse jobs matched to what you actually do",
  "Get an AI match score before you apply",
  "Apply, get hired, and get paid securely",
];

const clientSteps = [
  "Post a job with the skills and budget you need",
  "Review applicants ranked by AI match score",
  "Shortlist, interview, and hire with confidence",
  "Track work and pay only when it's approved",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { data, isLoading } = useJobs({ sortBy: "newest", limit: 3, page: 1 });
  const recentJobs = data?.jobs ?? [];
  const totalOpenJobs = data?.meta?.total ?? 0;

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-text-primary text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Freelance work, matched by what your skills actually say.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-text-secondary mt-6 text-lg"
          >
            Nexora reads the real overlap between a freelancer&apos;s profile
            and a job&apos;s requirements — so freelancers apply to jobs they
            can actually win, and clients hire people who actually fit.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/register?role=freelancer">
              <Button size="lg" className="w-full sm:w-auto">
                Find work
              </Button>
            </Link>
            <Link href="/register?role=client">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Hire talent
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <MatchPreviewCard />
      </section>

      {totalOpenJobs > 0 && (
        <section className="border-border bg-surface-muted border-y">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
            <p className="text-brand-600 text-3xl font-bold">
              <CountUp value={totalOpenJobs} suffix="+" />
            </p>
            <p className="text-text-secondary mt-1 text-sm">
              Open jobs on Nexora right now
            </p>
          </div>
        </section>
      )}

      {/* Real, live jobs — not placeholder content */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2>Recently posted jobs</h2>
          <Link
            href="/jobs"
            className="text-brand-600 flex items-center gap-1 text-sm font-medium"
          >
            Browse all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : recentJobs.length === 0 ? (
            <p className="text-text-secondary text-center text-sm">
              No open jobs yet — check back soon.
            </p>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category quick links — real filter targets, not decoration */}
      <section className="border-border bg-surface-muted border-y">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center">Browse by category</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {Object.entries(jobCategoryLabels).map(([value, label]) => (
              <Link
                key={value}
                href={`/jobs?category=${value}`}
                className="border-border bg-surface text-text-primary hover:border-brand-500 hover:text-brand-600 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center">How Nexora works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="rounded-card border-freelancer-500/20 bg-surface border p-6"
          >
            <h3 className="text-freelancer-500">For Freelancers</h3>
            <ol className="mt-4 space-y-3">
              {freelancerSteps.map((step, i) => (
                <li
                  key={step}
                  className="text-text-secondary flex gap-3 text-sm"
                >
                  <span className="text-freelancer-500 font-semibold">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-card border-client-500/20 bg-surface border p-6"
          >
            <h3 className="text-client-500">For Clients</h3>
            <ol className="mt-4 space-y-3">
              {clientSteps.map((step, i) => (
                <li
                  key={step}
                  className="text-text-secondary flex gap-3 text-sm"
                >
                  <span className="text-client-500 font-semibold">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="bg-brand-600"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-white">Ready to get matched?</h2>
          <p className="text-brand-100 mt-3">
            Join Nexora and let your skills do the talking.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create your account
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
