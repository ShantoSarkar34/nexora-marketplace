import { MessagesView } from "@/features/messaging/components/messages-view";

export default async function ClientConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MessagesView role="CLIENT" conversationId={id} />;
}
