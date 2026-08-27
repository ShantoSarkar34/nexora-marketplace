import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";

interface HandleApiErrorOptions {
  onUnauthorized?: () => void;
}

export function handleApiError(
  error: unknown,
  options?: HandleApiErrorOptions,
) {
  if (!(error instanceof ApiError)) {
    toast.error("Something went wrong. Please try again.");
    return;
  }

  switch (error.status) {
    case 401:
      options?.onUnauthorized?.();
      break;
    case 403:
      toast.error("You don't have permission to do that.");
      break;
    case 404:
      toast.error("We couldn't find what you were looking for.");
      break;
    case 409:
      // Conflict — spec calls this a warning, not a hard error
      toast.warning(error.message);
      break;
    case 429:
      toast.warning(
        error.message || "You're doing that too often — please wait a moment.",
      );
      break;
    case 0:
      toast.error(error.message);
      break;
    default:
      if (error.status >= 500) {
        toast.error(
          "Something went wrong on our end. Please try again shortly.",
        );
      } else {
        toast.error(error.message);
      }
  }
}
