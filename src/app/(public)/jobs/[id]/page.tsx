import { notFound } from "next/navigation";
import { Briefcase, Clock, DollarSign, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/lib/mock-data/jobs";
import { formatBudget, timeAgo } from "@/features/jobs/utils";
import { AIMatchCard } from "@/features/ai-match/components/ai-match-card";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Track B: replace with GET /jobs/:id
  const job = mockJobs.find((j) => j.id === id);

  if (!job) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={job.status === "OPEN" ? "success" : "neutral"}>
                {job.status}
              </Badge>
              <span className="text-text-secondary text-xs">
                Posted {timeAgo(job.postedAt)}
              </span>
            </div>
            <h1 className="mt-2">{job.title}</h1>
            <p className="text-text-secondary mt-1 text-sm">
              {job.clientName} · {job.category}
            </p>
          </div>

          <Card>
            <h3>Description</h3>
            <p className="text-text-secondary mt-3 text-sm whitespace-pre-line">
              {job.description}
            </p>
          </Card>

          <Card>
            <h3>Skills required</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge className="bg-brand-50 dark:bg-status-active/10 dark:text-status-active" key={skill} variant="brand">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">Budget</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {formatBudget(job)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">
                    Experience level
                  </p>
                  <p className="text-text-primary text-sm font-semibold">
                    {job.experienceLevel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">Applicants</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {job.applicantCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-text-secondary h-4 w-4" />
                <div>
                  <p className="text-text-secondary text-xs">Budget type</p>
                  <p className="text-text-primary text-sm font-semibold">
                    {job.budgetType === "HOURLY" ? "Hourly" : "Fixed price"}
                  </p>
                </div>
              </div>
            </div>

            {/* Track B: this triggers the real application flow (Phase 6) */}
            <Button className="mt-6 w-full">Apply Now</Button>
            <Button variant="secondary" className="mt-2 w-full">
              Save Job
            </Button>
          </Card>

          {/* Placeholder for Phase 10 — AI Job Match will render here */}
          <Card className="border-dashed">
            <p className="text-text-primary text-sm font-medium pb-2">
              AI Job Match
            </p>
            <AIMatchCard/>
          </Card>
        </div>
      </div>
    </div>
  );
}
