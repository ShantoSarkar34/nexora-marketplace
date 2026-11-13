import { Badge } from "@/components/ui/badge";

function variantFor(score: number): "success" | "brand" | "neutral" {
  if (score >= 75) return "success";
  if (score >= 50) return "brand";
  return "neutral";
}

export function MatchBadge({ score }: { score: number }) {
  return <Badge variant={variantFor(score)}>{score}% match</Badge>;
}
