export interface AIMatchResult {
  matchScore: number;
  matchingSkills: string[];
  strengths: string[];
  missingSkills: string[];
  recommendations: string[];
}
