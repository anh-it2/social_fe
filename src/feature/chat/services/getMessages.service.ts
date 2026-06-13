import { apiClient } from "@/shared/lib/apiClient";
import type { ChatHistoryResponseDTO } from "../dto/chat.dto";
import type { HistoryCursor } from "../types";

/**
 * Pull one page of conversation history from social-platform-be. Backend
 * owns the ordering (oldest→newest within a page; newer pages have larger
 * timestamps). Cursor = the `nextCurosr` returned by the previous page,
 * i.e. the createdAt epoch-ms of that page's oldest message.
 */
export async function getMessagesService(
  conversationId: string,
  cursor?: HistoryCursor,
  limit = 30,
): Promise<ChatHistoryResponseDTO> {
  const params = new URLSearchParams();
  if (cursor) {
    params.set("cursor", String(cursor.timestamp));
    if (cursor.id) params.set("cursorId", cursor.id);
  }
  params.set("limit", String(limit));
  const res = await apiClient.get<ChatHistoryResponseDTO>(
    `/api/chat/${encodeURIComponent(conversationId)}/messages?${params.toString()}`,
  );
  return res.data;
}
