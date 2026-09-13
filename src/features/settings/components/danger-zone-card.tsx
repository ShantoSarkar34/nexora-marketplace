"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth-mutations";

export function DangerZoneCard() {
  const router = useRouter();
  const logout = useLogout();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/");
  }

  return (
    <Card>
      <h3>Session</h3>
      <p className="text-text-secondary mt-2 text-sm">
        Log out of Nexora on this device.
      </p>
      <Button
        variant="destructive"
        className="mt-4"
        onClick={handleLogout}
        isLoading={logout.isPending}
      >
        <LogOut className="mr-1.5 h-4 w-4" />
        Log Out
      </Button>
    </Card>
  );
}
