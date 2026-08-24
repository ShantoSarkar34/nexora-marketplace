"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Skill } from "@/types/profile";

interface Props {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function SkillsSection({ skills, onChange }: Props) {
  const [newSkill, setNewSkill] = useState("");

  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill("");
      return;
    }
    // Track B: replace with real API call -> services/profile.ts:addSkill(trimmed)
    onChange([...skills, { id: `s-${Date.now()}`, name: trimmed }]);
    setNewSkill("");
  }

  function removeSkill(id: string) {
    // Track B: replace with real API call -> services/profile.ts:removeSkill(id)
    onChange(skills.filter((s) => s.id !== id));
  }

  return (
    <Card>
      <h3>Skills</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No skills added yet — add your first one below.
          </p>
        ) : (
          skills.map((skill) => (
            <Badge key={skill.id} variant="brand" className="gap-1.5 pr-1.5">
              {skill.name}
              <button
                onClick={() => removeSkill(skill.id)}
                aria-label={`Remove ${skill.name}`}
                className="rounded-full hover:bg-brand-100"
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
              addSkill();
            }
          }}
        />
        <Button type="button" size="sm" onClick={addSkill}>
          Add
        </Button>
      </div>
    </Card>
  );
}