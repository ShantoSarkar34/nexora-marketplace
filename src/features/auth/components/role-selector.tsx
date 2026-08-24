"use client";

import { Briefcase, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/features/auth/schemas";

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof Search;
}[] = [
  {
    value: "FREELANCER",
    label: "Freelancer",
    description: "I want to find work",
    icon: Search,
  },
  {
    value: "CLIENT",
    label: "Client",
    description: "I want to hire talent",
    icon: Briefcase,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = value === role.value;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors",
              isActive
                ? "border-brand-600 bg-brand-50 dark:bg-brand-600/15"
                : "border-border hover:bg-surface-muted",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-brand-600" : "text-text-secondary",
              )}
            />
            <span className="text-text-primary text-sm font-medium">
              {role.label}
            </span>
            <span className="text-text-secondary text-xs">
              {role.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
