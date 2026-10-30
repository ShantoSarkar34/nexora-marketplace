import { toast } from "sonner";

import { ApiError, isSuspendedError } from "@/lib/api-client";

interface HandleApiErrorOptions {
  source?: "query" | "mutation";
  rateLimitMessage?: string;
  onUnauthorized?: () => void;
  onSuspended?: () => void;
}

export function handleApiError(
  error: unknown,
  options: HandleApiErrorOptions = {},
) {
  if (!(error instanceof ApiError)) {
    toast.error("Something went wrong. Please try again.");
    return;
  }

  if (isSuspendedError(error)) {
    options.onSuspended?.();
    return;
  }

  switch (error.status) {
    case 401:
      if (options.source === "mutation") {
        toast.error(error.message || "Please log in to continue.");
      }
      options.onUnauthorized?.();
      break;
    case 403:
      toast.error("You don't have permission to do that.");
      break;
    case 404:
      toast.error("We couldn't find what you were looking for.");
      break;
    case 409:
      // Conflict is a warning, not a hard error.
      toast.warning(error.message);
      break;
    case 429:
      toast.warning(
        options.rateLimitMessage ??
          (error.message ||
            "You're doing that too often. Please wait a moment."),
      );
      break;
    case 502:
    case 503:
      toast.error(
        "This feature is temporarily unavailable. Please try again later.",
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
