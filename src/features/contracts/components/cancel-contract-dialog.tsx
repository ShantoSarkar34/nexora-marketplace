"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCancelContract } from "@/hooks/use-contracts";
import {
  cancelContractSchema,
  type CancelContractFormValues,
} from "@/features/contracts/schemas";

interface Props {
  contractId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelContractDialog({
  contractId,
  open,
  onOpenChange,
}: Props) {
  const cancelContract = useCancelContract();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelContractFormValues>({
    resolver: zodResolver(cancelContractSchema),
  });

  async function onSubmit(values: CancelContractFormValues) {
    try {
      await cancelContract.mutateAsync({ contractId, reason: values.reason });
      toast.success("Contract cancelled.");
      reset();
      onOpenChange(false);
    } catch {
      // toasted globally
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Cancel contract">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="reason">Reason for cancellation</Label>
          <Textarea
            id="reason"
            rows={3}
            placeholder="Explain why you're cancelling..."
            {...register("reason")}
          />
          {errors.reason && (
            <p className="text-status-error mt-1 text-xs">
              {errors.reason.message}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="destructive"
            isLoading={cancelContract.isPending}
          >
            Confirm Cancellation
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Never mind
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
