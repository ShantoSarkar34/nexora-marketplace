"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, ShieldCheck, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const differentiators = [
  {
    icon: Brain,
    title: "AI-powered matching",
    description:
      "Before a freelancer applies, they see exactly how their skills and experience line up with a job's requirements — matching skills, gaps, and tailored recommendations, not just a keyword search.",
  },
  {
    icon: Workflow,
    title: "A clear project lifecycle",
    description:
      "From application to hire to payment to delivery, every contract has a defined status. Both sides always know exactly what stage a project is in and what happens next.",
  },
  {
    icon: ShieldCheck,
    title: "Payment protection built in",
    description:
      "Contracts stay pending until payment is confirmed, work is only marked complete after client approval, and every finished project builds a verified review history.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.h1 variants={fadeUp} transition={{ duration: 0.5 }}>
            About Nexora
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-6 text-lg text-text-secondary"
          >
            Most freelance marketplaces are search engines, not matchmakers.
            Nexora reads the real overlap between what a freelancer can do
            and what a job actually needs — so applying and hiring both start
            from an honest signal, not a guess.
          </motion.p>
        </motion.div>
      </section>

      <section className="border-y border-border bg-surface-muted">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <h2>Why we built this</h2>
            <p className="mt-4 text-text-secondary">
              Freelancers scroll through hundreds of listings hoping
              something fits. Clients wade through applicants hoping one of
              them can actually do the job. Neither side gets a real signal
              until the work has already started — and by then, a bad fit is
              expensive for everyone.
            </p>
            <p className="mt-4 text-text-secondary">
              Nexora starts from a simpler idea: skills and requirements can
              be compared directly, before either side commits. A freelancer
              sees their match score before applying. A client sees the same
              breakdown before reviewing an application. The rest of the
              platform — contracts, payments, reviews — exists to carry that
              honest match through to a finished, paid project.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          What makes Nexora different
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {differentiators.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-card border border-border bg-surface p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface-muted">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="grid gap-8 md:grid-cols-2"
          >
            <div className="rounded-card border border-freelancer-500/20 bg-surface p-6">
              <h3 className="text-freelancer-500">Built for freelancers</h3>
              <p className="mt-3 text-sm text-text-secondary">
                A profile that actually represents your work — skills,
                experience, and portfolio — feeding directly into how well
                you match with jobs, not just how your listing ranks in a
                search.
              </p>
            </div>
            <div className="rounded-card border border-client-500/20 bg-surface p-6">
              <h3 className="text-client-500">Built for clients</h3>
              <p className="mt-3 text-sm text-text-secondary">
                Post a job once, review applicants ranked by real fit, and
                move from hire to payment to delivery with a contract
                timeline that always shows where things stand.
              </p>
            </div>
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
          <h2 className="text-white">Ready to try it yourself?</h2>
          <p className="mt-3 text-brand-100">
            Join as a freelancer or post your first job as a client.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register?role=freelancer">
              <Button size="lg" variant="secondary">Find work</Button>
            </Link>
            <Link href="/register?role=client">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-brand-50">
                Hire talent
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}