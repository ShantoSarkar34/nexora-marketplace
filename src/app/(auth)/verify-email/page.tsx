import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { VerifyEmailContent } from "@/features/auth/components/verify-email-content";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
