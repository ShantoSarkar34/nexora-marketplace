"use client";

import { useState } from "react";
import { PenSquare } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EditableSectionProps {
  title: string;
  action?: React.ReactNode;
  renderView: () => React.ReactNode;
  renderEdit: (close: () => void) => React.ReactNode;
}

export function EditableSection({
  title,
  action,
  renderView,
  renderEdit,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3>{title}</h3>
        <div className="flex items-center gap-2">
          {action}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${title}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            >
              <PenSquare className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-4">
        {isEditing ? renderEdit(() => setIsEditing(false)) : renderView()}
      </div>
    </Card>
  );
}

export { Button };