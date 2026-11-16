import { DisputeDetail } from "@/features/disputes/components/dispute-detail";

export default async function ClientDisputePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DisputeDetail role="CLIENT" disputeId={id} />;
}
