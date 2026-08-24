import Link from "next/link";
import { XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  return (
    <Card className="mx-auto max-w-md text-center">
      <XCircle className="text-status-error mx-auto h-10 w-10" />
      <h2 className="mt-3">Payment cancelled</h2>
      <p className="text-text-secondary mt-2 text-sm">
        No charge was made. You can try again anytime from your contracts.
      </p>
      <Link href="/client/contracts">
        <Button variant="secondary" className="mt-5">
          Back to Contracts
        </Button>
      </Link>
    </Card>
  );
}
