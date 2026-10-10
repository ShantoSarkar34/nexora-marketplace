"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  Palette,
  PenLine,
  Megaphone,
  Database,
  Server,
  Layers3,
} from "lucide-react";

import { jobCategoryLabels } from "@/types/enums";

const categoryIcons = {
  WEB_DEVELOPMENT: Code2,
  MOBILE_DEVELOPMENT: Smartphone,
  DESIGN: Palette,
  WRITING: PenLine,
  MARKETING: Megaphone,
  DATA_SCIENCE: Database,
  DEVOPS: Server,
  OTHER: Layers3,
} as const;

const categoryDescriptions = {
  WEB_DEVELOPMENT: "Websites, apps & frontend",
  MOBILE_DEVELOPMENT: "iOS & Android apps",
  DESIGN: "UI/UX & visual design",
  WRITING: "Content, blogs & copy",
  MARKETING: "Growth, SEO & social media",
  DATA_SCIENCE: "Analytics & machine learning",
  DEVOPS: "Cloud, CI/CD & infrastructure",
  OTHER: "Explore other specialties",
} as const;

export function HomeCategories() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-brand-600 text-sm font-semibold tracking-wide">
            EXPLORE OPPORTUNITIES
          </span>

          <h2 className="text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Find work in your field
          </h2>

          <p className="text-text-secondary mt-4 text-base leading-7 sm:text-lg">
            Explore projects across different specialties and find opportunities
            that match your skills.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {Object.entries(jobCategoryLabels).map(([value, label]) => {
            const Icon = categoryIcons[value as keyof typeof categoryIcons];

            return (
              <Link
                key={value}
                href={`/jobs?category=${value}`}
                className="group border-border bg-surface hover:border-brand-500/50 hover:bg-brand-500/3 relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="bg-brand-500/10 text-brand-600 group-hover:bg-brand-500/15 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>

                  <ArrowUpRight className="text-text-secondary group-hover:text-brand-600 h-5 w-5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <h3 className="text-text-primary mt-5 text-base font-semibold">
                  {label}
                </h3>

                <p className="text-text-secondary mt-2 text-sm leading-6">
                  {
                    categoryDescriptions[
                      value as keyof typeof categoryDescriptions
                    ]
                  }
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
