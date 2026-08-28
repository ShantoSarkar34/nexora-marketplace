import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
