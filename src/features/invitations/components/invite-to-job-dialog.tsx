"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  inviteSchema,
  type InviteFormValues,
} from "@/features/invitations/schemas";
import { useCreateInvitation } from "@/hooks/use-invitations";
import { useMyJobs } from "@/hooks/use-jobs";
import { ApiError } from "@/lib/api-client";
import { applyApiFieldErrors } from "@/lib/apply-api-field-errors";
import type { Job } from "@/types/job";

const MESSAGE_LIMIT = 500;

interface InviteToJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  freelancerId: string;
  freelancerName: string;
  // Preselected when it is one of the client's open jobs.
  defaultJobId?: string;
}

export function InviteToJobDialog({
  open,
  onOpenChange,
  freelancerId,
  freelancerName,
  defaultJobId,
}: InviteToJobDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Invite ${freelancerName}`}
    >
      {/* The Dialog only renders its children while open, so the jobs request
          below only fires once someone actually opens it. */}
      <InviteForm
        freelancerId={freelancerId}
        freelancerName={freelancerName}
        defaultJobId={defaultJobId}
        onDone={() => onOpenChange(false)}
      />
    </Dialog>
  );
}

interface InviteFormProps {
  freelancerId: string;
  freelancerName: string;
  defaultJobId?: string;
  onDone: () => void;
}

function InviteForm(props: InviteFormProps) {
  const { data, isLoading, isError, refetch } = useMyJobs({ limit: 50 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 py-4 text-center">
        <p className="text-text-secondary text-sm">
          We couldn&apos;t load your jobs.
        </p>
        <Button variant="secondary" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const openJobs = (data?.jobs ?? []).filter((job) => job.status === "OPEN");

  if (openJobs.length === 0) {
    return (
      <div className="space-y-4">
        <Alert variant="info">
          You need an open job to send an invitation. Publish a job first, then
          invite {props.freelancerName} to it.
        </Alert>
        <div className="flex gap-2">
          <Link href="/client/jobs/create">
            <Button>Post a job</Button>
          </Link>
          <Link href="/client/jobs">
            <Button variant="secondary">Manage my jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <InviteFormBody {...props} openJobs={openJobs} />;
}

function InviteFormBody({
  freelancerId,
  freelancerName,
  defaultJobId,
  onDone,
  openJobs,
}: InviteFormProps & { openJobs: Job[] }) {
  const createInvitation = useCreateInvitation();
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const initialJobId =
    openJobs.find((job) => job.id === defaultJobId)?.id ??
    (openJobs.length === 1 ? (openJobs[0]?.id ?? "") : "");

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { jobId: initialJobId, message: "" },
  });

  const messageLength = (watch("message") ?? "").length;

  async function onSubmit(values: InviteFormValues) {
    setServerMessage(null);
    try {
      await createInvitation.mutateAsync({
        jobId: values.jobId,
        freelancerId,
        message: values.message?.trim() || undefined,
      });
      toast.success(`Invitation sent to ${freelancerName}.`);
      onDone();
    } catch (error) {
      if (!(error instanceof ApiError)) return;
      if (error.errors) applyApiFieldErrors(setError, error.errors);
      // A 409 says whether they were already invited or have already applied.
      // A 400 without field errors means the job can't take invitations.
      if (error.status === 409 || (error.status === 400 && !error.errors)) {
        setServerMessage(error.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverMessage && <Alert variant="warning">{serverMessage}</Alert>}

      <div>
        <Label htmlFor="invite-job">Job</Label>
        <Select id="invite-job" {...register("jobId")}>
          <option value="">Choose a job</option>
          {openJobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </Select>
        {errors.jobId && (
          <p className="text-status-error mt-1 text-xs">
            {errors.jobId.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="invite-message">Message (optional)</Label>
        <Textarea
          id="invite-message"
          rows={4}
          maxLength={MESSAGE_LIMIT}
          placeholder={`Tell ${freelancerName} why you think they'd be a great fit...`}
          {...register("message")}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.message ? (
            <p className="text-status-error text-xs">
              {errors.message.message}
            </p>
          ) : (
            <span />
          )}
          <span className="text-text-secondary text-xs">
            {messageLength}/{MESSAGE_LIMIT}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" isLoading={createInvitation.isPending}>
          Send invitation
        </Button>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
