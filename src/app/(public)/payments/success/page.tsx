"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { apiClient } from "@/lib/api-client";
import type { Payment } from "@/types/payment";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15; // ~30 seconds total

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"polling" | "success" | "timeout">(
    "polling",
  );
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;

    async function poll() {
      // Track: session_id from Stripe doesn't directly map to a lookup
      // endpoint in the doc, so we rely on the most recent payment for the
      // logged-in user instead. Adjust here if the backend later exposes a
      // GET /payments/session/:sessionId lookup.
      try {
        const res = await apiClient.get<Payment[]>("/payments/me?limit=1");
        const latest = res.data[0];
        if (latest && latest.status === "SUCCESS") {
          if (!cancelled) {
            setPayment(latest);
            setStatus("success");
          }
          return;
        }
      } catch {
        // keep polling despite transient errors
      }

      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        if (!cancelled) setStatus("timeout");
        return;
      }
      if (!cancelled) setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === "polling") {
    return (
      <Card className="mx-auto max-w-md text-center">
        <Spinner className="mx-auto h-8 w-8" />
        <h2 className="mt-4">Confirming your payment...</h2>
        <p className="text-text-secondary mt-2 text-sm">
          This usually takes just a few seconds.
        </p>
      </Card>
    );
  }

  if (status === "timeout") {
    return (
      <Card className="mx-auto max-w-md text-center">
        <XCircle className="text-status-pending mx-auto h-10 w-10" />
        <h2 className="mt-3">Still processing</h2>
        <p className="text-text-secondary mt-2 text-sm">
          Your payment is taking longer than expected to confirm. Check your
          contracts in a moment — it should update shortly.
        </p>
        <Link href="/client/contracts">
          <Button className="mt-5">View Contracts</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md text-center">
      <CheckCircle2 className="text-status-active mx-auto h-10 w-10" />
      <h2 className="mt-3">Payment successful</h2>
      <p className="text-text-secondary mt-2 text-sm">
        {payment ? `Payment of $${payment.amount} received. ` : ""}
        The contract is now active.
      </p>
      <Link href="/client/contracts">
        <Button className="mt-5">View Contracts</Button>
      </Link>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Suspense fallback={<Spinner className="mx-auto h-8 w-8" />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
