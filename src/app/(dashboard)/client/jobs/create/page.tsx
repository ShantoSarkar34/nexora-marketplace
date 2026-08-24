import { CreateJobForm } from "@/features/jobs/components/create-job-form";

export default function CreateJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Post a Job</h1>
        <p className="mt-1 text-text-secondary">
          Fill in the details below to attract the right freelancers.
        </p>
      </div>
      <CreateJobForm />
    </div>
  );
}