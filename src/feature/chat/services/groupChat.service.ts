import { apiClient } from "@/shared/lib/apiClient";
import type { ChatMessageDTO } from "../dto/chat.dto";
import type { ReplyContext } from "../types";
import type { GroupInfo } from "../stores/chat.store.type";

export async function getMyGroupsService(): Promise<GroupInfo[]> {
  const response = await apiClient.get<GroupInfo[]>("/api/chat/groups");
  return response.data;
}

export async function createGroupService(input: {
  name: string;
  memberIds: string[];
}): Promise<GroupInfo> {
  const response = await apiClient.post<GroupInfo>("/api/chat/groups", input);
  return response.data;
}

export async function sendGroupMessageService(
  conversationId: string,
  input: {
    content: string;
    type: "text" | "image" | "file" | "video";
    replyTo?: ReplyContext;
  },
): Promise<ChatMessageDTO> {
  const response = await apiClient.post<ChatMessageDTO>(
    `/api/chat/${encodeURIComponent(conversationId)}/messages`,
    {
      content: input.content,
      type: input.type,
      replyToId: input.replyTo?.id,
    },
  );
  return response.data;
}
