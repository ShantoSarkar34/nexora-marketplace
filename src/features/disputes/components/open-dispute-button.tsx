"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OpenDisputeDialog } from "@/features/disputes/components/open-dispute-dialog";
import { canOpenDispute } from "@/features/disputes/utils";
import type { ContractStatus } from "@/types/enums";

export function OpenDisputeButton({
  contractId,
  status,
}: {
  contractId: string;
  status: ContractStatus;
}) {
  const [open, setOpen] = useState(false);

  if (!canOpenDispute(status)) return null;

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        <Flag className="mr-1.5 h-4 w-4" />
        Open dispute
      </Button>
      <OpenDisputeDialog
        contractId={contractId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
