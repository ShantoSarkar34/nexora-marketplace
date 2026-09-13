"use client";

import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";

export function AppearanceCard() {
  return (
    <Card>
      <h3>Appearance</h3>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary text-sm font-medium">Theme</p>
            <p className="text-text-secondary text-xs">
              Choose light, dark, or match your system
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="border-border flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-text-primary text-sm font-medium">Language</p>
            <p className="text-text-secondary text-xs">
              Choose your preferred language
            </p>
          </div>
          <LanguageToggle />
        </div>
      </div>
    </Card>
  );
}
