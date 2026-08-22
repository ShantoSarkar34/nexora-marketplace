"use client";

import { motion } from "framer-motion";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-card border-border bg-surface w-full max-w-md border p-8 shadow-sm"
    >
      <h1 className="text-text-primary text-2xl font-semibold">{title}</h1>
      {description && (
        <p className="text-text-secondary mt-1.5 text-sm">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}
