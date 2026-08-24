import { notFound } from "next/navigation";

import { EditJobForm } from "@/features/jobs/components/edit-job-form";
import { mockJobs } from "@/lib/mock-data/jobs";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Track B: replace with GET /jobs/:id
  const job = mockJobs.find((j) => j.id === id);

  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1>Edit Job</h1>
        <p className="mt-1 text-text-secondary">{job.title}</p>
      </div>
      <EditJobForm job={job} />
    </div>
  );
}