"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api-client";
import {
  useAnalyzeJob,
  useRuleBasedMatch,
  useSavedAnalysis,
} from "@/hooks/use-ai-match";

export function AIMatchCard({ jobId }: { jobId: string }) {
  const ruleBasedQuery = useRuleBasedMatch(jobId, true);
  const {
    analysis,
    isLoading: analysisLoading,
    notFound,
  } = useSavedAnalysis(jobId, true);
  const analyzeJob = useAnalyzeJob();

  console.log(ruleBasedQuery)

  async function handleDeepAnalyze() {
    try {
      await analyzeJob.mutateAsync(jobId);
      toast.success("Analysis complete!");
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        toast.warning(
          error.message ||
            "Daily AI analysis limit reached — try again tomorrow.",
        );
      }
      // other errors toasted globally
    }
  }

  const showAnalysis = analysis && !analyzeJob.isPending;

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Sparkles className="text-brand-600 h-4 w-4" />
        <h3>AI Job Match</h3>
      </div>

      {/* Tier 1: instant rule-based score, always shown */}
      <div className="mt-4">
        {ruleBasedQuery.isLoading ? (
          <div className="text-text-secondary flex items-center gap-2 text-sm">
            <Spinner className="h-4 w-4" />
            Calculating match...
          </div>
        ) : ruleBasedQuery.data ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-brand-50 text-brand-700 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
                {ruleBasedQuery.data.matchScore}%
              </div>
              <div>
                <p className="text-text-primary text-sm font-medium">
                  Quick match score
                </p>
                <p className="text-text-secondary text-xs">
                  Based on your skills, instantly calculated
                </p>
              </div>
            </div>
            {ruleBasedQuery.data.breakdown.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {ruleBasedQuery.data.breakdown.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="text-text-primary font-medium">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Tier 2: deep AI analysis — rate limited, saved */}
      <div className="border-border mt-5 border-t pt-4">
        {analysisLoading ? (
          <div className="flex justify-center py-2">
            <Spinner className="h-5 w-5" />
          </div>
        ) : showAnalysis ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-text-primary text-sm font-medium">
                  Deep AI Analysis
                </p>
                <span className="text-text-secondary text-xs">
                  {new Date(analysis!.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <div className="bg-brand-50 text-brand-700 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
                  {analysis!.matchScore}%
                </div>
              </div>

              {analysis!.strengths.length > 0 && (
                <div>
                  <p className="text-text-secondary text-xs font-medium">
                    Strengths
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {analysis!.strengths.map((s) => (
                      <li key={s} className="text-text-secondary text-xs">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis!.missingSkills.length > 0 && (
                <div>
                  <p className="text-text-secondary text-xs font-medium">
                    Missing skills
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {analysis!.missingSkills.map((skill) => (
                      <Badge key={skill} variant="warning">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis!.recommendation && (
                <div>
                  <p className="text-text-secondary flex items-center gap-1.5 text-xs font-medium">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Recommendation
                  </p>
                  <p className="text-text-secondary mt-1.5 text-xs">
                    {analysis!.recommendation}
                  </p>
                </div>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={handleDeepAnalyze}
                isLoading={analyzeJob.isPending}
              >
                Re-analyze
              </Button>

              <p className="text-text-secondary text-[11px]">
                This analysis is a recommendation, not a guarantee — use it as a
                starting point.
              </p>
            </motion.div>
          </AnimatePresence>
        ) : analyzeJob.isPending ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Spinner className="h-6 w-6" />
            <p className="text-text-secondary text-xs">
              Running deep analysis...
            </p>
          </div>
        ) : (
          <div>
            <p className="text-text-secondary text-sm">
              Get a detailed breakdown: matching skills, gaps, and tailored
              recommendations for this job.
            </p>
            <Button
              className="mt-3 w-full"
              onClick={handleDeepAnalyze}
              isLoading={analyzeJob.isPending}
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              Run Deep Analysis
            </Button>
            {analyzeJob.isError &&
              !(
                analyzeJob.error instanceof ApiError &&
                analyzeJob.error.status === 429
              ) && (
                <div className="text-status-error mt-2 flex items-center gap-1.5 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Something went wrong — try again.
                </div>
              )}
          </div>
        )}
      </div>
    </Card>
  );
}
