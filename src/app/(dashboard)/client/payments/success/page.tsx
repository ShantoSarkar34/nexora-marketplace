import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function SuccessContent() {
  return (
    <Card className="mx-auto max-w-md text-center">
      <CheckCircle2 className="text-status-active mx-auto h-10 w-10" />
      <h2 className="mt-3">Payment successful</h2>
      <p className="text-text-secondary mt-2 text-sm">
        {/* Track B: this page must re-fetch the real payment status from the
        backend rather than trusting this redirect — the backend's webhook
        is the source of truth. */}
        Your payment has been received. The contract is now active.
      </p>
      <Link href="/client/contracts">
        <Button className="mt-5">View Contracts</Button>
      </Link>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto h-8 w-8" />}>
      <SuccessContent />
    </Suspense>
  );
}
