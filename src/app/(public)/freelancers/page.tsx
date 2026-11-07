import type { Metadata } from "next";

import { TalentDirectory } from "@/features/talent/components/talent-directory";

export const metadata: Metadata = {
  title: "Find Talent — Nexora",
  description:
    "Search Nexora freelancers by skill, hourly rate, experience level, availability, and rating.",
};

export default async function FindTalentPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string | string[] }>;
}) {
  const { jobId } = await searchParams;

  return (
    <TalentDirectory
      inviteJobId={typeof jobId === "string" ? jobId : undefined}
    />
  );
}
