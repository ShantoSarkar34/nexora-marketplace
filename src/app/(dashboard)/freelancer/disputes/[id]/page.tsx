import { DisputeDetail } from "@/features/disputes/components/dispute-detail";

export default async function FreelancerDisputePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DisputeDetail role="FREELANCER" disputeId={id} />;
}
