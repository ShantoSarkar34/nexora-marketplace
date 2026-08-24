"use client";

import { useState } from "react";

import { ClientBasicsSection } from "@/features/profile/components/client-basics-section";
import { mockClientProfile } from "@/lib/mock-data/profiles";
import type { ClientProfile } from "@/types/profile";

export default function ClientProfilePage() {
  // Track B: replace with GET /profile/me
  const [profile, setProfile] = useState<ClientProfile>(mockClientProfile);

  return (
    <div className="space-y-6">
      <div>
        <h1>Company Profile</h1>
        <p className="text-text-secondary mt-1">
          This is how freelancers see your company when reviewing your jobs.
        </p>
      </div>
      <ClientBasicsSection
        profile={profile}
        onSave={(values) => setProfile((p) => ({ ...p, ...values }))}
      />
    </div>
  );
}
