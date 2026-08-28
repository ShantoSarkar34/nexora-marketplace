"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddSkill, useRemoveSkill } from "@/hooks/use-freelancer-profile";
import type { Skill } from "@/types/profile";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [newSkill, setNewSkill] = useState("");
  const addSkill = useAddSkill();
  const removeSkill = useRemoveSkill();

  async function handleAdd() {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill("");
      return;
    }
    try {
      await addSkill.mutateAsync(trimmed);
      setNewSkill("");
    } catch {
      // toasted globally
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeSkill.mutateAsync(id);
    } catch {
      // toasted globally
    }
  }

  return (
    <Card>
      <h3>Skills</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-text-secondary text-sm">
            No skills added yet — add your first one below.
          </p>
        ) : (
          skills.map((skill) => (
            <Badge key={skill.id} variant="brand" className="gap-1.5 pr-1.5">
              {skill.name}
              <button
                onClick={() => handleRemove(skill.id)}
                aria-label={`Remove ${skill.name}`}
                className="hover:bg-brand-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          placeholder="e.g. GraphQL"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          isLoading={addSkill.isPending}
        >
          Add
        </Button>
      </div>
    </Card>
  );
}
