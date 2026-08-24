"use client";

import { useMemo, useState } from "react";

import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { FreelancerBasicsSection } from "@/features/profile/components/freelancer-basics-section";
import { SkillsSection } from "@/features/profile/components/skills-section";
import { ExperienceSection } from "@/features/profile/components/experience-section";
import { PortfolioSection } from "@/features/profile/components/portfolio-section";
import { mockFreelancerProfile } from "@/lib/mock-data/profiles";
import type { FreelancerProfile } from "@/types/profile";

function calculateCompletion(profile: FreelancerProfile) {
  const checks = [
    profile.bio.length > 20,
    profile.hourlyRate > 0,
    profile.skills.length >= 3,
    profile.experience.length >= 1,
    profile.portfolio.length >= 1,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function FreelancerProfilePage() {
  // Track B: replace with GET /profile/me, and each section's onChange
  // becomes its own mutation call instead of local setState
  const [profile, setProfile] = useState<FreelancerProfile>(mockFreelancerProfile);
  const completion = useMemo(() => calculateCompletion(profile), [profile]);

  return (
    <div className="space-y-6">
      <div>
        <h1>My Profile</h1>
        <p className="mt-1 text-text-secondary">
          This is how clients see you when reviewing applications.
        </p>
      </div>

      <ProfileCompletionCard percentage={completion} />

      <FreelancerBasicsSection
        profile={profile}
        onSave={(values) => setProfile((p) => ({ ...p, ...values }))}
      />
      <SkillsSection
        skills={profile.skills}
        onChange={(skills) => setProfile((p) => ({ ...p, skills }))}
      />
      <ExperienceSection
        experience={profile.experience}
        onChange={(experience) => setProfile((p) => ({ ...p, experience }))}
      />
      <PortfolioSection
        portfolio={profile.portfolio}
        onChange={(portfolio) => setProfile((p) => ({ ...p, portfolio }))}
      />
    </div>
  );
}