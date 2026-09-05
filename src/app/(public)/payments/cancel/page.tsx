import Link from "next/link";
import { XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card className="mx-auto max-w-md text-center">
        <XCircle className="mx-auto h-10 w-10 text-status-error" />
        <h2 className="mt-3">Payment cancelled</h2>
        <p className="mt-2 text-sm text-text-secondary">
          No charge was made. You can try again anytime from your contracts.
        </p>
        <Link href="/client/contracts">
          <Button variant="secondary" className="mt-5">
            Back to Contracts
          </Button>
        </Link>
      </Card>
    </div>
  );
}