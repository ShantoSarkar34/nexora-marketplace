import type { Metadata } from "next";

import { TalentDirectory } from "@/features/talent/components/talent-directory";

export const metadata: Metadata = {
  title: "Find Talent — Nexora",
  description:
    "Search Nexora freelancers by skill, hourly rate, experience level, availability, and rating.",
};

export default function FindTalentPage() {
  return <TalentDirectory />;
}