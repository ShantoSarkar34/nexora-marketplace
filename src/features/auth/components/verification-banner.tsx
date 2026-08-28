"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useSendVerificationOtp,
  useVerifyOtp,
} from "@/hooks/use-auth-mutations";
import { ApiError } from "@/lib/api-client";

export function VerificationBanner() {
  const [step, setStep] = useState<"prompt" | "code">("prompt");
  const [otp, setOtp] = useState("");
  const sendOtp = useSendVerificationOtp();
  const verifyOtp = useVerifyOtp();

  async function handleSend() {
    try {
      await sendOtp.mutateAsync();
      toast.success("Verification code sent — check your email.");
      setStep("code");
    } catch {
      // toasted globally (covers 429 rate limit too — 5/hour)
    }
  }

  async function handleVerify() {
    if (otp.length !== 6) return;
    try {
      await verifyOtp.mutateAsync(otp);
      toast.success("Your account is now verified.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        toast.error(error.message || "Incorrect code — please try again.");
      }
      setOtp("");
    }
  }

  return (
    <div className="border-status-pending/30 bg-status-pending/10 flex items-start gap-3 rounded-md border p-4 text-sm">
      <ShieldAlert className="text-status-pending mt-0.5 h-4 w-4 shrink-0" />
      <div className="text-text-primary w-full">
        <p className="font-medium">Verify your account</p>

        {step === "prompt" && (
          <div className="mt-2">
            <p>
              Your email isn&apos;t verified yet. Verified accounts appear more
              trustworthy.
            </p>
            <Button
              size="sm"
              className="mt-3"
              onClick={handleSend}
              isLoading={sendOtp.isPending}
            >
              Send verification code
            </Button>
          </div>
        )}

        {step === "code" && (
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <div>
              <p className="mb-1">Enter the 6-digit code we emailed you</p>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-32 tracking-widest"
              />
            </div>
            <Button
              size="sm"
              onClick={handleVerify}
              isLoading={verifyOtp.isPending}
            >
              Verify
            </Button>
            <button
              type="button"
              onClick={handleSend}
              className="text-brand-600 text-xs font-medium hover:underline"
            >
              Resend code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
