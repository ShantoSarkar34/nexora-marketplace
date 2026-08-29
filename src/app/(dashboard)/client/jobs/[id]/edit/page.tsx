"use client";

import { useParams, notFound } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { EditJobForm } from "@/features/jobs/components/edit-job-form";
import { useJob } from "@/hooks/use-jobs";

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const { data: job, isLoading, isError } = useJob(params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (isError || !job) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1>Edit Job</h1>
        <p className="text-text-secondary mt-1">{job.title}</p>
      </div>
      <EditJobForm job={job} />
    </div>
  );
}
