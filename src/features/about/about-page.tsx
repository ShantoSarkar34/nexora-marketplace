"use client";

import { AboutHero } from "./components/about-hero";
import { AboutStory } from "./components/about-story";

export function AboutPage() {
  return (
    <div className="bg-surface">
      <AboutHero />
      <AboutStory />
    </div>
  );
}
