import type { StatusCounts } from "@/types/dashboard";

// "1 contract", "3 contracts"
export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function countOf<S extends string>(
  counts: StatusCounts<S> | undefined,
  status: S,
): number {
  return counts?.byStatus[status] ?? 0;
}
