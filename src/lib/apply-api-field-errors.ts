import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function applyApiFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors?: Record<string, string[]>,
): string | undefined {
  if (!errors) return undefined;

  let formError: string | undefined;

  for (const [field, messages] of Object.entries(errors)) {
    const message = messages[0];
    if (!message) continue;

    if (field === "_form") {
      formError = message;
      setError("root.server", { type: "server", message });
      continue;
    }

    setError(field as Path<T>, { type: "server", message });
  }

  return formError;
}
