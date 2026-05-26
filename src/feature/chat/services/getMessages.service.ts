import { apiClient } from "@/shared/lib/apiClient";
import type { ChatHistoryResponseDTO } from "../dto/chat.dto";

/**
 * Pull one page of conversation history from social-platform-be. Backend
 * owns the ordering (oldest→newest within a page; newer pages have larger
 * timestamps). Cursor = the `nextCurosr` returned by the previous page,
 * i.e. the createdAt epoch-ms of that page's oldest message.
 */
export async function getMessagesService(
  conversationId: string,
  cursor?: number,
  limit = 30,
): Promise<ChatHistoryResponseDTO> {
  const params = new URLSearchParams();
  if (cursor !== undefined) params.set("cursor", String(cursor));
  params.set("limit", String(limit));
  const res = await apiClient.get<ChatHistoryResponseDTO>(
    `/api/chat/${encodeURIComponent(conversationId)}/messages?${params.toString()}`,
  );
  return res.data;
}
