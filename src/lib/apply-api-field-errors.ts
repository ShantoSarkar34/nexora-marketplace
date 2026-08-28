import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function applyApiFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors?: Record<string, string[]>,
) {
  if (!errors) return;
  for (const [field, messages] of Object.entries(errors)) {
    setError(field as Path<T>, { type: "server", message: messages[0] });
  }
}
