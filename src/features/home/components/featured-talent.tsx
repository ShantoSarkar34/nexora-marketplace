"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import { useFeaturedTalent } from "@/hooks/use-featured-talent";
import { FeaturedTalentCard } from "./featured-talent-card";

function TalentCardSkeleton() {
  return (
    <div className="border-border bg-surface animate-pulse rounded-2xl border p-6">
      <div className="flex items-center gap-4">
        <div className="bg-muted h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="bg-muted h-4 w-2/3 rounded" />
          <div className="bg-muted h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="bg-muted mt-6 h-16 rounded" />
      <div className="mt-5 flex gap-2">
        <div className="bg-muted h-7 w-16 rounded-full" />
        <div className="bg-muted h-7 w-20 rounded-full" />
        <div className="bg-muted h-7 w-14 rounded-full" />
      </div>
      <div className="bg-muted mt-6 h-10 rounded" />
    </div>
  );
}

export function FeaturedTalent() {
  const { data, isLoading, isError, refetch } = useFeaturedTalent(1, 6);
  const freelancers = data?.freelancers ?? [];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-brand-600 text-sm font-semibold tracking-wide">
              MEET THE TALENT
            </span>
            <h2 className="text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Skilled people. Real potential.
            </h2>
            <p className="text-text-secondary mt-4 text-base leading-7 sm:text-lg">
              Discover freelancers with skills to help bring your next project
              to life.
            </p>
          </div>

          <div className="text-text-secondary flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            Discover talented freelancers
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <TalentCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="border-border bg-surface mt-10 rounded-2xl border px-6 py-12 text-center">
            <p className="text-text-primary font-medium">
              We couldn&apos;t load freelancers right now.
            </p>
            <p className="text-text-secondary mt-2 text-sm">
              Please try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-brand-600 hover:bg-brand-600/90 mt-5 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        ) : freelancers.length === 0 ? (
          <div className="border-border bg-surface mt-10 rounded-2xl border px-6 py-12 text-center">
            <Users className="text-text-secondary mx-auto h-8 w-8" />
            <p className="text-text-primary mt-3 font-medium">
              No freelancer profiles to show yet.
            </p>
            <p className="text-text-secondary mt-2 text-sm">
              Check back soon as more freelancers join Nexora.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {freelancers.map((freelancer) => (
              <FeaturedTalentCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        )}

        {!isLoading && !isError && freelancers.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/freelancers"
              className="border-border text-text-primary hover:border-brand-500/50 hover:bg-brand-500/3 inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors"
            >
              Explore freelancers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
