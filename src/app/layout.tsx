import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nexora — AI-Powered Freelance Marketplace",
  description:
    "Connect skilled freelancers with clients through intelligent job matching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}