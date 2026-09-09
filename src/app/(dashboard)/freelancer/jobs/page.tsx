import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { JobListing } from "@/features/jobs/components/job-listing";

export default function FreelancerBrowseJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <JobListing />
    </Suspense>
  );
}
