import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { formatContractDate, safeHttpUrl } from "@/features/contracts/utils";
import type { Contract } from "@/types/contract";

interface SubmittedWorkCardProps {
  contract: Contract;
  title?: string;
  // Buttons shown under the work, for example Approve and Request Revision.
  actions?: ReactNode;
}

export function SubmittedWorkCard({
  contract,
  title = "Submitted work",
  actions,
}: SubmittedWorkCardProps) {
  const hasContent = !!(contract.submissionNote || contract.submissionUrl);
  // Without content or actions there is nothing to show.
  if (!hasContent && !actions) return null;

  const link = safeHttpUrl(contract.submissionUrl);

  return (
    <Card>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3>{title}</h3>
        {contract.submittedAt && (
          <span className="text-text-secondary text-xs">
            Submitted {formatContractDate(contract.submittedAt)}
          </span>
        )}
      </div>

      {contract.submissionNote && (
        <p className="text-text-secondary mt-3 text-sm whitespace-pre-line">
          {contract.submissionNote}
        </p>
      )}

      {contract.submissionUrl &&
        (link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 mt-3 block text-sm font-medium break-all"
          >
            View submitted work →
          </a>
        ) : (
          // Not an http(s) link, so it is shown as text and never clickable.
          <p className="text-text-secondary mt-3 text-sm break-all">
            {contract.submissionUrl}
          </p>
        ))}

      {!hasContent && (
        <p className="text-text-secondary mt-3 text-sm">
          No note or link was included with this submission.
        </p>
      )}

      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
