import type { Application } from "@/types/application";

// Track B: replace with GET /applications (role-aware)
export const mockApplications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "React Frontend Developer for SaaS Dashboard",
    clientName: "NexTek Labs",
    freelancerId: "freelancer-1",
    freelancerName: "Sarah Khan",
    freelancerTitle: "Full-Stack Developer",
    freelancerAvatarInitials: "SK",
    coverLetter:
      "I've built several React dashboards with similar chart/table requirements. I'd love to bring that experience to this project and can start immediately.",
    proposedBudget: 2400,
    estimatedDays: 14,
    status: "PENDING",
    appliedAt: "2026-08-20",
  },
  {
    id: "app-2",
    jobId: "job-3",
    jobTitle: "Node.js Backend for Marketplace Platform",
    clientName: "Marketloop Inc.",
    freelancerId: "freelancer-1",
    freelancerName: "Sarah Khan",
    freelancerTitle: "Full-Stack Developer",
    freelancerAvatarInitials: "SK",
    coverLetter:
      "I have 3 years of experience building marketplace backends with Prisma and PostgreSQL, including payment webhook handling.",
    proposedBudget: 28,
    estimatedDays: 30,
    status: "SHORTLISTED",
    appliedAt: "2026-08-16",
  },
  {
    id: "app-3",
    jobId: "job-8",
    jobTitle: "Landing Page Design + Build",
    clientName: "Launchpad Studio",
    freelancerId: "freelancer-1",
    freelancerName: "Sarah Khan",
    freelancerTitle: "Full-Stack Developer",
    freelancerAvatarInitials: "SK",
    coverLetter:
      "Excited about this launch page — I can deliver a polished, fast build within your timeline.",
    proposedBudget: 900,
    estimatedDays: 7,
    status: "HIRED",
    appliedAt: "2026-08-10",
  },
  {
    id: "app-4",
    jobId: "job-11",
    jobTitle: "Junior Frontend Developer (Vue)",
    clientName: "Northstar Apps",
    freelancerId: "freelancer-1",
    freelancerName: "Sarah Khan",
    freelancerTitle: "Full-Stack Developer",
    freelancerAvatarInitials: "SK",
    coverLetter:
      "Applying to expand my Vue experience alongside my React background.",
    proposedBudget: 15,
    estimatedDays: 20,
    status: "REJECTED",
    appliedAt: "2026-08-08",
  },
];

// Extra applicants for the client-side "Applications" screen (job-1)
export const mockJobApplicants: Application[] = [
  mockApplications[0]!,
  {
    id: "app-5",
    jobId: "job-1",
    jobTitle: "React Frontend Developer for SaaS Dashboard",
    clientName: "NexTek Labs",
    freelancerId: "freelancer-2",
    freelancerName: "Daniyal Ahmed",
    freelancerTitle: "Senior React Engineer",
    freelancerAvatarInitials: "DA",
    coverLetter:
      "8 years of frontend experience, including 3 SaaS dashboard rebuilds. Portfolio and references available on request.",
    proposedBudget: 2900,
    estimatedDays: 10,
    status: "SHORTLISTED",
    appliedAt: "2026-08-19",
  },
  {
    id: "app-6",
    jobId: "job-1",
    jobTitle: "React Frontend Developer for SaaS Dashboard",
    clientName: "NexTek Labs",
    freelancerId: "freelancer-3",
    freelancerName: "Priya Sharma",
    freelancerTitle: "Frontend Developer",
    freelancerAvatarInitials: "PS",
    coverLetter:
      "I specialize in data visualization and would love to contribute to this dashboard.",
    proposedBudget: 2100,
    estimatedDays: 16,
    status: "PENDING",
    appliedAt: "2026-08-21",
  },
];
