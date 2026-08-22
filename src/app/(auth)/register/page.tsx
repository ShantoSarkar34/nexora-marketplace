import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}