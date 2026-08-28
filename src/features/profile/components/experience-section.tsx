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
import {
  useAddExperience,
  useRemoveExperience,
} from "@/hooks/use-freelancer-profile";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/features/profile/schemas";
import type { Experience } from "@/types/profile";

function formatRange(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean,
) {
  const fmt = (d: string) =>
    new Date(`${d}-01`).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  return `${fmt(startDate)} – ${isCurrent || !endDate ? "Present" : fmt(endDate)}`;
}

export function ExperienceSection({
  experience,
}: {
  experience: Experience[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const addExperience = useAddExperience();
  const removeExperience = useRemoveExperience();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
  });
  const isCurrent = watch("isCurrent");

  async function onSubmit(values: ExperienceInput) {
    try {
      await addExperience.mutateAsync(values);
      reset();
      setIsAdding(false);
    } catch {
      // toasted globally
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeExperience.mutateAsync(id);
    } catch {
      // toasted globally
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3>Experience</h3>
        {!isAdding && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="border-border flex justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-text-primary text-sm font-medium">
                {exp.title}
              </p>
              <p className="text-text-secondary text-xs">
                {exp.company} ·{" "}
                {formatRange(exp.startDate, exp.endDate, exp.isCurrent)}
              </p>
              {exp.description && (
                <p className="text-text-secondary mt-1.5 text-sm">
                  {exp.description}
                </p>
              )}
            </div>
            <button
              onClick={() => handleRemove(exp.id)}
              aria-label="Remove experience"
              className="text-text-secondary hover:text-status-error h-7 w-7 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {experience.length === 0 && !isAdding && (
          <p className="text-text-secondary text-sm">
            No experience added yet.
          </p>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="border-border mt-4 space-y-4 overflow-hidden border-t pt-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="expTitle">Job title</Label>
                <Input id="expTitle" {...register("title")} />
                {errors.title && (
                  <p className="text-status-error mt-1 text-xs">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="expCompany">Company</Label>
                <Input id="expCompany" {...register("company")} />
                {errors.company && (
                  <p className="text-status-error mt-1 text-xs">
                    {errors.company.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="expStart">Start date</Label>
                <Input id="expStart" type="month" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-status-error mt-1 text-xs">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="expEnd">End date</Label>
                <Input
                  id="expEnd"
                  type="month"
                  disabled={isCurrent}
                  {...register("endDate")}
                />
              </div>
            </div>
            <label className="text-text-secondary flex items-center gap-2 text-sm">
              <Checkbox {...register("isCurrent")} />I currently work here
            </label>
            <div>
              <Label htmlFor="expDescription">Description (optional)</Label>
              <Textarea
                id="expDescription"
                rows={3}
                {...register("description")}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                isLoading={addExperience.isPending}
              >
                Save
              </Button>
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
