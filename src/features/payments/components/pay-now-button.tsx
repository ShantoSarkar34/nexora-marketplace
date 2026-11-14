"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateCheckout } from "@/hooks/use-payments";
import { ApiError } from "@/lib/api-client";

interface PayNowButtonProps {
  contractId: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}

export function PayNowButton({
  contractId,
  label = "Pay Now",
  size = "md",
  variant = "primary",
}: PayNowButtonProps) {
  const qc = useQueryClient();
  const createCheckout = useCreateCheckout();
  // The browser needs a moment to leave for Stripe after the request finishes.
  // Staying busy until then stops a double click from opening two checkouts.
  const [redirecting, setRedirecting] = useState(false);

  async function handlePay() {
    try {
      const { checkoutUrl } = await createCheckout.mutateAsync(contractId);
      if (!checkoutUrl || !/^https:\/\//i.test(checkoutUrl)) {
        throw new Error("Missing checkout URL");
      }
      setRedirecting(true);
      // A full redirect to Stripe's hosted page, not a response we render.
      window.location.href = checkoutUrl;
    } catch (error) {
      setRedirecting(false);

      if (error instanceof ApiError) {
        // The server's message is already toasted globally. A 400 or 409 can
        // mean the contract was just paid or activated, so refresh the page.
        if (error.status === 400 || error.status === 409) {
          void qc.invalidateQueries({ queryKey: ["contracts"] });
        }
        return;
      }
      toast.error("Couldn't start checkout. Please try again.");
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handlePay}
      isLoading={createCheckout.isPending || redirecting}
    >
      {label}
    </Button>
  );
}
