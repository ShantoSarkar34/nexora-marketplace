"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Sparkles, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { AIMatchResult } from "@/types/ai-match";

type MatchState = "idle" | "loading" | "success" | "error";

// Track B: replace with real API call -> POST /jobs/:id/analyze-match
// (rule-based matching first, per project principles, before any external AI API)
const mockResult: AIMatchResult = {
  matchScore: 87,
  matchingSkills: ["React", "TypeScript", "Tailwind CSS"],
  strengths: [
    "Strong overlap in core frontend stack",
    "Portfolio includes a similar dashboard project",
  ],
  missingSkills: ["GraphQL"],
  recommendations: [
    "Mention your dashboard project directly in your proposal",
    "Consider a short note on how you'd approach the missing GraphQL requirement",
  ],
};

export function AIMatchCard({ jobId }: { jobId: string }) {
  const [state, setState] = useState<MatchState>("idle");
  const [result, setResult] = useState<AIMatchResult | null>(null);

  async function analyze() {
    setState("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setResult(mockResult);
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 p-0">
        <Sparkles className="text-brand-600 h-4 w-4" />
        <h3>AI Job Match</h3>
      </div>

      {state === "idle" && (
        <div className="mt-3">
          <p className="text-text-secondary text-sm">
            See how well your profile matches this job before you apply.
          </p>
          <Button className="mt-3 w-full" onClick={analyze}>
            Analyze My Match
          </Button>
        </div>
      )}

      {state === "loading" && (
        <div className="mt-4 flex flex-col items-center gap-2 py-4">
          <Spinner className="h-6 w-6" />
          <p className="text-text-secondary text-xs">
            Analyzing your profile...
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="mt-3 space-y-3">
          <div className="text-status-error flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">Something went wrong. Please try again.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={analyze}>
            Retry
          </Button>
        </div>
      )}

      <AnimatePresence>
        {state === "success" && result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-500/10 text-brand-700 dark:text-brand-600 text-md flex h-12 w-13 items-center justify-center rounded-full font-bold">
                {result.matchScore}%
              </div>
              <div>
                <p className="text-text-primary text-sm font-medium">
                  Strong match
                </p>
                <p className="text-text-secondary text-xs">
                  Based on your skills and experience
                </p>
              </div>
            </div>

            <div>
              <p className="text-text-secondary text-xs font-medium">
                Matching skills
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {result.matchingSkills.map((skill) => (
                  <Badge key={skill} variant="success">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {result.missingSkills.length > 0 && (
              <div>
                <p className="text-text-secondary text-xs font-medium">
                  Missing skills
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {result.missingSkills.map((skill) => (
                    <Badge key={skill} variant="warning">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-text-secondary flex items-center gap-1.5 text-xs font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                Recommendations
              </p>
              <ul className="mt-1.5 space-y-1">
                {result.recommendations.map((rec) => (
                  <li key={rec} className="text-text-secondary text-xs">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-text-secondary text-[11px]">
              This analysis is a recommendation, not a guarantee — use it as a
              starting point.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
