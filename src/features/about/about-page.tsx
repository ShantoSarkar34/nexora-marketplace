"use client";

import { AboutHero } from "./components/about-hero";
import { AboutLifecycle } from "./components/about-lifecycle";
import { AboutPrinciples } from "./components/about-principles";
import { AboutStory } from "./components/about-story";

export function AboutPage() {
  return (
    <div className="bg-surface">
      <AboutHero />
      <AboutStory />
      <AboutPrinciples />
      <AboutLifecycle />
    </div>
  );
}
