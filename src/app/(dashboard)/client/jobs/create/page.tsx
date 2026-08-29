import { CreateJobForm } from "@/features/jobs/components/create-job-form";

export default function CreateJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Post a Job</h1>
        <p className="mt-1 text-text-secondary">
          Jobs start as a draft — you&apos;ll publish it from My Jobs once you&apos;re ready.
        </p>
      </div>
      <CreateJobForm />
    </div>
  );
}