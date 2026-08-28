"use client";

import { UserPlus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  actionLabel: string;
  onCreate: () => void;
  isLoading: boolean;
}

export function CreateProfilePrompt({
  title,
  description,
  actionLabel,
  onCreate,
  isLoading,
}: Props) {
  return (
    <Card className="flex flex-col items-center gap-3 border-dashed py-12 text-center">
      <div className="bg-brand-50 text-brand-600 flex h-12 w-12 items-center justify-center rounded-full">
        <UserPlus className="h-6 w-6" />
      </div>
      <div>
        <p className="text-text-primary text-sm font-medium">{title}</p>
        <p className="text-text-secondary mt-1 max-w-sm text-sm">
          {description}
        </p>
      </div>
      <Button className="mt-2" onClick={onCreate} isLoading={isLoading}>
        {actionLabel}
      </Button>
    </Card>
  );
}
