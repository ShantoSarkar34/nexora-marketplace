import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
