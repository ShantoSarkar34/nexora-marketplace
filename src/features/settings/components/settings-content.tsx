"use client";

import { Spinner } from "@/components/ui/spinner";
import { AccountInfoCard } from "@/features/settings/components/account-info-card";
import { AppearanceCard } from "@/features/settings/components/appearance-card";
import { ChangePasswordCard } from "@/features/settings/components/change-password-card";
import { DangerZoneCard } from "@/features/settings/components/danger-zone-card";
import { DeleteAccountCard } from "@/features/settings/components/delete-account-card";
import { EditNameCard } from "@/features/settings/components/edit-name-card";
import { useAuth } from "@/hooks/use-auth";

export function SettingsContent() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-text-secondary mt-1">
          Manage your account and preferences.
        </p>
      </div>
      <AccountInfoCard user={user} />
      <EditNameCard user={user} />
      <ChangePasswordCard user={user} />
      <AppearanceCard />
      <DangerZoneCard />
      <DeleteAccountCard user={user} />
    </div>
  );
}
