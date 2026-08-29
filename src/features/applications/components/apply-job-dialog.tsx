"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import { ApiError } from "@/lib/api-client";
import { useApplyToJob } from "@/hooks/use-applications";
import {
  applyJobSchema,
  type ApplyJobFormInput,
  type ApplyJobFormValues,
} from "@/features/applications/schemas";
import type { Job } from "@/types/job";

interface Props {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyJobDialog({ job, open, onOpenChange }: Props) {
  const applyToJob = useApplyToJob();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplyJobFormInput, unknown, ApplyJobFormValues>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: { proposedBudget: job.budgetMin },
  });

  async function onSubmit(values: ApplyJobFormValues) {
    try {
      await applyToJob.mutateAsync({ jobId: job.id, values });
      toast.success("Application submitted!");
      reset();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        applyApiFieldErrors(setError, error.errors);
      }
      // 409 (already applied) etc. toasted globally
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Apply to ${job.title}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="coverLetter">Cover letter</Label>
          <Textarea
            id="coverLetter"
            rows={5}
            placeholder="Explain why you're a great fit for this job (min. 50 characters)..."
            {...register("coverLetter")}
          />
          {errors.coverLetter && (
            <p className="text-status-error mt-1 text-xs">
              {errors.coverLetter.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="proposedBudget">Proposed budget ($)</Label>
            <Input
              id="proposedBudget"
              type="number"
              {...register("proposedBudget")}
            />
            {errors.proposedBudget && (
              <p className="text-status-error mt-1 text-xs">
                {errors.proposedBudget.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="estimatedDeliveryDays">Delivery time (days)</Label>
            <Input
              id="estimatedDeliveryDays"
              type="number"
              {...register("estimatedDeliveryDays")}
            />
            {errors.estimatedDeliveryDays && (
              <p className="text-status-error mt-1 text-xs">
                {errors.estimatedDeliveryDays.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting || applyToJob.isPending}
          >
            Submit Application
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
