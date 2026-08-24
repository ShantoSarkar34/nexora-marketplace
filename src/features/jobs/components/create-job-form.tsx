"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
  CreateJobFormInput,
  createJobSchema,
  type CreateJobFormValues,
} from "@/features/jobs/schemas";

export function CreateJobForm() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormInput, unknown, CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { budgetType: "FIXED", experienceLevel: "Intermediate" },
  });

  async function onSubmit(values: CreateJobFormValues) {
    // Track B: replace with real API call -> services/jobs.ts:createJob(values)
    console.log("Create job (mock):", values);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSuccess(true);
  }

  if (success) {
    return (
      <Alert variant="success">
        Your job has been posted (mock). It will appear in &quot;My Jobs&quot;
        once real data is wired up in Track B.
      </Alert>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="title">Job title</Label>
          <Input
            id="title"
            placeholder="e.g. React Developer for E-commerce Site"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-status-error mt-1 text-xs">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={6}
            placeholder="Describe the project, deliverables, and requirements..."
            {...register("description")}
          />
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
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="experienceLevel">Experience level</Label>
            <Select id="experienceLevel" {...register("experienceLevel")}>
              <option value="Entry">Entry</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="skills">Required skills</Label>
          <Input
            id="skills"
            placeholder="React, TypeScript, Tailwind CSS (comma separated)"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-status-error mt-1 text-xs">
              {errors.skills.message}
            </p>
          )}
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
            {errors.budgetMin && (
              <p className="text-status-error mt-1 text-xs">
                {errors.budgetMin.message}
              </p>
            )}
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

        <Button type="submit" isLoading={isSubmitting}>
          Post Job
        </Button>
      </form>
    </Card>
  );
}
