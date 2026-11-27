import type { Metadata } from "next";

import { AboutPage } from "@/features/about/about-page";

export const metadata: Metadata = {
  title: "About Nexora",
  description:
    "Nexora is a freelance marketplace built around a shared view of skills, scope, and expectations, so clients and freelancers can move work forward with confidence.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
