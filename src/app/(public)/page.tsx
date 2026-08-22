import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MatchPreviewCard } from "@/components/shared/match-preview-card";

const stats = [
  { label: "Active freelancers", value: "12,400+" },
  { label: "Jobs posted monthly", value: "3,200+" },
  { label: "Avg. match accuracy", value: "94%" },
];

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

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Freelance work, matched by what your skills actually say.
          </h1>
          <p className="mt-6 text-lg text-text-secondary">
            Nexora reads the real overlap between a freelancer&apos;s profile
            and a job&apos;s requirements — so freelancers apply to jobs they
            can actually win, and clients hire people who actually fit.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register?role=freelancer">
              <Button size="lg" className="w-full sm:w-auto">
                Find work
              </Button>
            </Link>
            <Link href="/register?role=client">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Hire talent
              </Button>
            </Link>
          </div>
        </div>
        <MatchPreviewCard />
      </section>

      <section className="border-y border-border bg-surface-muted">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-brand-600">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center">How Nexora works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-card border border-freelancer-500/20 bg-surface p-6">
            <h3 className="text-freelancer-500">For Freelancers</h3>
            <ol className="mt-4 space-y-3">
              {freelancerSteps.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-3 text-sm text-text-secondary"
                >
                  <span className="font-semibold text-freelancer-500">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-card border border-client-500/20 bg-surface p-6">
            <h3 className="text-client-500">For Clients</h3>
            <ol className="mt-4 space-y-3">
              {clientSteps.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-3 text-sm text-text-secondary"
                >
                  <span className="font-semibold text-client-500">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-white">Ready to get matched?</h2>
          <p className="mt-3 text-brand-100">
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
      </section>
    </div>
  );
}