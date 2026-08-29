"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import { ApiError } from "@/lib/api-client";
import { useUpdateJob } from "@/hooks/use-jobs";
import { experienceLevelLabels, jobCategoryLabels } from "@/types/enums";
import {
  createJobSchema,
  type CreateJobFormInput,
  type CreateJobFormValues,
} from "@/features/jobs/schemas";
import type { Job } from "@/types/job";
import { getJobSkillNames } from "../utils";

export function EditJobForm({ job }: { job: Job }) {
  const updateJob = useUpdateJob(job.id);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormInput, unknown, CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      category: job.category,
      skills: getJobSkillNames(job).join(", "),
      budgetType: job.budgetType,
      budgetMin: job.budgetMin,
      budgetMax: job.budgetMax,
      experienceLevel: job.experienceLevel,
      deadline: job.deadline,
    },
  });

  async function onSubmit(values: CreateJobFormValues) {
    try {
      await updateJob.mutateAsync(values);
      toast.success("Job updated.");
    } catch (error) {
      if (error instanceof ApiError && error.errors)
        applyApiFieldErrors(setError, error.errors);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="title">Job title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-status-error mt-1 text-xs">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={6} {...register("description")} />
          {errors.description && (
            <p className="text-status-error mt-1 text-xs">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" {...register("category")}>
              {Object.entries(jobCategoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="experienceLevel">Experience level</Label>
            <Select id="experienceLevel" {...register("experienceLevel")}>
              {Object.entries(experienceLevelLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="skills">Required skills</Label>
          <Input id="skills" {...register("skills")} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="budgetType">Budget type</Label>
            <Select id="budgetType" {...register("budgetType")}>
              <option value="FIXED">Fixed price</option>
              <option value="HOURLY">Hourly</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="budgetMin">Min budget ($)</Label>
            <Input id="budgetMin" type="number" {...register("budgetMin")} />
          </div>
          <div>
            <Label htmlFor="budgetMax">Max budget ($)</Label>
            <Input id="budgetMax" type="number" {...register("budgetMax")} />
            {errors.budgetMax && (
              <p className="text-status-error mt-1 text-xs">
                {errors.budgetMax.message}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" isLoading={isSubmitting || updateJob.isPending}>
          Save Changes
        </Button>
      </form>
    </Card>
  );
}
