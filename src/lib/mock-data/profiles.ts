import type { ClientProfile, FreelancerProfile } from "@/types/profile";

// Track B: replace with real GET /profile/me (role-aware) response
export const mockFreelancerProfile: FreelancerProfile = {
  name: "Sarah Khan",
  title: "Full-Stack Developer",
  bio: "I build fast, accessible web applications with React and Node.js. 5+ years working with startups to ship production-ready products.",
  hourlyRate: 35,
  location: "Dhaka, Bangladesh",
  avatarInitials: "SK",
  skills: [
    { id: "s1", name: "React" },
    { id: "s2", name: "TypeScript" },
    { id: "s3", name: "Node.js" },
    { id: "s4", name: "PostgreSQL" },
    { id: "s5", name: "Tailwind CSS" },
  ],
  experience: [
    {
      id: "e1",
      title: "Frontend Developer",
      company: "PixelForge Studio",
      startDate: "2023-03",
      endDate: null,
      description:
        "Building and maintaining client-facing React applications, leading component architecture decisions.",
    },
    {
      id: "e2",
      title: "Junior Web Developer",
      company: "Brightside Digital",
      startDate: "2021-06",
      endDate: "2023-02",
      description:
        "Developed and shipped features for e-commerce clients using Vue.js and Laravel.",
    },
  ],
  portfolio: [
    {
      id: "p1",
      title: "SaaS Analytics Dashboard",
      description:
        "A React + D3.js dashboard for visualizing subscription metrics.",
      link: "https://example.com/project-1",
    },
    {
      id: "p2",
      title: "E-commerce Storefront Redesign",
      description:
        "Full redesign and rebuild of a Shopify storefront, improving load time by 40%.",
    },
  ],
};

// Track B: replace with real GET /profile/me (role-aware) response
export const mockClientProfile: ClientProfile = {
  name: "Michael Chen",
  companyName: "NexTek Labs",
  companyDescription:
    "We build developer tools for distributed teams. Currently a team of 12, hiring freelance specialists for focused product work.",
  industry: "Software / SaaS",
  location: "San Francisco, USA",
  website: "https://nextek-labs.example.com",
  avatarInitials: "MC",
};
