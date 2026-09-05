"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateCheckout } from "@/hooks/use-payments";

export function PayNowButton({ contractId }: { contractId: string }) {
  const createCheckout = useCreateCheckout();

  async function handlePay() {
    try {
      const { checkoutUrl } = await createCheckout.mutateAsync(contractId);
      // Full browser redirect to Stripe's hosted checkout page —
      // this is not a fetch response we render, it's a navigation.
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
    }
  }

  return (
    <Button onClick={handlePay} isLoading={createCheckout.isPending}>
      Pay Now
    </Button>
  );
}
