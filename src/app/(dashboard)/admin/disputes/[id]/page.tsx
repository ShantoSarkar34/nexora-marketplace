import { AdminDisputeDetail } from "@/features/admin/components/admin-dispute-detail";

export default async function AdminDisputePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminDisputeDetail disputeId={id} />;
}