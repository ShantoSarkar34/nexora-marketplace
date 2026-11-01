import Link from "next/link";

import { Avatar } from "@/components/shared/avatar";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/job";

interface JobPosterProps {
  job: Pick<Job, "clientId" | "clientName" | "clientImageUrl" | "companyName">;
  size?: "sm" | "md";
  // Show only the company (or client) name, without the person's name below.
  compact?: boolean;
  // Turn the link off when the poster sits inside another link.
  link?: boolean;
  className?: string;
}

export function JobPoster({
  job,
  size = "sm",
  compact = false,
  link = true,
  className,
}: JobPosterProps) {
  // Company name leads; the person's name is the second line.
  const primary = job.companyName || job.clientName || "Client";
  const secondary =
    !compact && job.companyName && job.clientName ? job.clientName : null;

  const content = (
    <>
      <Avatar
        name={primary}
        imageUrl={job.clientImageUrl}
        size={size}
        accent="client"
      />
      <div className="min-w-0">
        <p className="text-text-primary truncate text-sm font-medium">
          {primary}
        </p>
        {secondary && (
          <p className="text-text-secondary truncate text-xs">{secondary}</p>
        )}
      </div>
    </>
  );

  const classes = cn("flex min-w-0 items-center gap-2", className);

  if (!link || !job.clientId) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link
      href={`/clients/${job.clientId}`}
      className={cn(classes, "hover:opacity-80")}
    >
      {content}
    </Link>
  );
}
