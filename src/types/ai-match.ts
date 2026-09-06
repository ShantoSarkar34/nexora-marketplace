export interface RuleBasedMatch {
  matchScore: number;
  breakdown: {
    label: string;
    score: number;
    maxScore: number;
  }[];
}

export interface AIAnalysis {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  recommendation: string;
  updatedAt: string;
}
