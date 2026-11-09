"use client";

import { Card } from "@/components/ui/card";
import { InviteToJobButton } from "@/features/invitations/components/invite-to-job-button";
import { ProfileMessageButton } from "@/features/messaging/components/profile-message-button";
import { useAuth } from "@/hooks/use-auth";

export function InviteTalentCard({
  freelancerId,
  freelancerName,
}: {
  freelancerId: string;
  freelancerName: string;
}) {
  const { user } = useAuth();

  if (user?.role !== "CLIENT") return null;

  return (
    <Card>
      <h2 className="text-text-primary text-base font-semibold">
        Interested in working together?
      </h2>
      <p className="text-text-secondary mt-2 text-sm leading-6">
        Invite {freelancerName} to one of your open jobs. They&apos;ll be
        notified and can choose to apply.
      </p>
      <InviteToJobButton
        freelancerId={freelancerId}
        freelancerName={freelancerName}
        variant="primary"
        className="mt-4 w-full"
      />
      {/* Only appears once you already have a conversation with them. */}
      <ProfileMessageButton
        userId={freelancerId}
        size="md"
        className="mt-2 w-full"
      />
    </Card>
  );
}
