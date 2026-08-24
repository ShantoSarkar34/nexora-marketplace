import type { Contract } from "@/types/contract";

// Track B: replace with GET /contracts (role-aware)
export const mockContracts: Contract[] = [
  {
    id: "contract-1",
    jobTitle: "Landing Page Design + Build",
    clientName: "Launchpad Studio",
    freelancerName: "Sarah Khan",
    budget: 900,
    budgetType: "FIXED",
    status: "ACTIVE",
    startedAt: "2026-08-12",
  },
  {
    id: "contract-2",
    jobTitle: "Portfolio Site Refresh",
    clientName: "Studio Verve",
    freelancerName: "Sarah Khan",
    budget: 600,
    budgetType: "FIXED",
    status: "SUBMITTED",
    startedAt: "2026-08-05",
    submittedAt: "2026-08-20",
    workSubmissionNote:
      "All pages are complete and deployed to the staging URL shared earlier. Let me know if you'd like any revisions before launch.",
  },
  {
    id: "contract-3",
    jobTitle: "Blog Content Sprint",
    clientName: "CloudBase",
    freelancerName: "Sarah Khan",
    budget: 450,
    budgetType: "FIXED",
    status: "COMPLETED",
    startedAt: "2026-07-15",
    submittedAt: "2026-07-28",
    completedAt: "2026-07-30",
  },
];
