"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { paymentsService } from "@/services/payments";
import type { Payment } from "@/types/payment";

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 1500;

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<
    "verifying" | "success" | "pending" | "error"
  >("verifying");
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    async function verify(attempt = 1) {
      try {
        const result = await paymentsService.verifySession(sessionId!);
        if (cancelled) return;

        if (result.status === "SUCCESS") {
          setPayment(result);
          setStatus("success");
          return;
        }

        if (attempt < MAX_ATTEMPTS) {
          setTimeout(() => verify(attempt + 1), RETRY_DELAY_MS);
        } else {
          setStatus("pending");
        }
      } catch {
        if (cancelled) return;
        if (attempt < MAX_ATTEMPTS) {
          setTimeout(() => verify(attempt + 1), RETRY_DELAY_MS);
        } else {
          setStatus("pending");
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === "error") {
    return (
      <Card className="mx-auto max-w-md text-center">
        <XCircle className="text-status-error mx-auto h-10 w-10" />
        <h2 className="mt-3">Missing payment session</h2>
        <p className="text-text-secondary mt-2 text-sm">
          We couldn&apos;t find a payment session to verify. If you completed a
          payment, check your contracts — it should reflect there shortly.
        </p>
        <Link href="/client/contracts">
          <Button className="mt-5">View Contracts</Button>
        </Link>
      </Card>
    );
  }

  if (status === "verifying") {
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

  if (status === "pending") {
    return (
      <Card className="mx-auto max-w-md text-center">
        <XCircle className="text-status-pending mx-auto h-10 w-10" />
        <h2 className="mt-3">Still processing</h2>
        <p className="text-text-secondary mt-2 text-sm">
          Your payment is taking longer than expected to confirm. Check your
          contracts in a moment — it should update shortly once Stripe finishes
          processing.
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
      {payment?.contractId ? (
        <Link href={`/client/contracts/${payment.contractId}`}>
          <Button className="mt-5">View Contract</Button>
        </Link>
      ) : (
        <Link href="/client/contracts">
          <Button className="mt-5">View Contracts</Button>
        </Link>
      )}
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
