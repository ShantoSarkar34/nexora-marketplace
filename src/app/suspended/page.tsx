import type { Metadata } from "next";
import Link from "next/link";
import { ShieldOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Account suspended — Nexora",
};

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <ShieldOff className="text-status-error mx-auto h-10 w-10" />
        <h1 className="mt-4 text-2xl">Account suspended</h1>
        <p className="text-text-secondary mt-2 text-sm">
          Your account has been suspended, so you can&apos;t sign in or use
          Nexora right now. If you think this is a mistake, please contact the
          Nexora team.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </Card>
    </div>
  );
}
