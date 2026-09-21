import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function ContactCta() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="bg-brand-600 mx-auto max-w-5xl overflow-hidden rounded-2xl">
        <div className="px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-14">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            Ready to get started with Nexora?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Join a growing marketplace where clients find talent and freelancers
            discover new opportunities.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="text-brand-700 inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/90"
            >
              Create an account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse opportunities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
