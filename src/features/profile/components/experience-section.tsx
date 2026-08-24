"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { experienceSchema, type ExperienceInput } from "@/features/profile/schemas";
import type { Experience } from "@/types/profile";

interface Props {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

function formatRange(startDate: string, endDate: string | null) {
  const fmt = (d: string) =>
    new Date(`${d}-01`).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  return `${fmt(startDate)} – ${endDate ? fmt(endDate) : "Present"}`;
}

export function ExperienceSection({ experience, onChange }: Props) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExperienceInput>({ resolver: zodResolver(experienceSchema) });

  const isCurrent = watch("isCurrent");

  function onSubmit(values: ExperienceInput) {
    // Track B: replace with real API call -> services/profile.ts:addExperience(values)
    onChange([
      ...experience,
      {
        id: `e-${Date.now()}`,
        title: values.title,
        company: values.company,
        startDate: values.startDate,
        endDate: values.isCurrent ? null : (values.endDate ?? null),
        description: values.description,
      },
    ]);
    reset();
    setIsAdding(false);
  }

  function removeExperience(id: string) {
    // Track B: replace with real API call -> services/profile.ts:removeExperience(id)
    onChange(experience.filter((e) => e.id !== id));
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3>Experience</h3>
        {!isAdding && (
          <Button type="button" size="sm" variant="secondary" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {experience.map((exp) => (
          <div key={exp.id} className="flex justify-between gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-text-primary">{exp.title}</p>
              <p className="text-xs text-text-secondary">
                {exp.company} · {formatRange(exp.startDate, exp.endDate)}
              </p>
              <p className="mt-1.5 text-sm text-text-secondary">{exp.description}</p>
            </div>
            <button
              onClick={() => removeExperience(exp.id)}
              aria-label="Remove experience"
              className="h-7 w-7 shrink-0 text-text-secondary hover:text-status-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {experience.length === 0 && !isAdding && (
          <p className="text-sm text-text-secondary">No experience added yet.</p>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 space-y-4 overflow-hidden border-t border-border pt-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="expTitle">Job title</Label>
                <Input id="expTitle" {...register("title")} />
                {errors.title && (
                  <p className="mt-1 text-xs text-status-error">{errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="expCompany">Company</Label>
                <Input id="expCompany" {...register("company")} />
                {errors.company && (
                  <p className="mt-1 text-xs text-status-error">{errors.company.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="expStart">Start date</Label>
                <Input id="expStart" type="month" {...register("startDate")} />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-status-error">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="expEnd">End date</Label>
                <Input id="expEnd" type="month" disabled={isCurrent} {...register("endDate")} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <Checkbox {...register("isCurrent")} />
              I currently work here
            </label>
            <div>
              <Label htmlFor="expDescription">Description</Label>
              <Textarea id="expDescription" rows={3} {...register("description")} />
              {errors.description && (
                <p className="mt-1 text-xs text-status-error">{errors.description.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">Save</Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  reset();
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
}