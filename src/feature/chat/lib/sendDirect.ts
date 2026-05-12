import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { ChatMessageDTO } from "../dto/chat.dto";
import { toSendMessageDto } from "../dto/chat.mapper";
import { getChatSocket } from "../socket";
import { useChatStore } from "../stores/chat.store";
import type { ChatMessage } from "../types";
import { buildDmId } from "./conversation";

export interface SendDirectResult {
  conversationId: string;
  tempId: string;
  status: "sent" | "queued";
}

export function sendDirectMessage(
  toUserId: string,
  content: string,
  type: ChatMessage["type"] = "text",
): Promise<SendDirectResult> {
  return new Promise((resolve, reject) => {
    const {
      isLoggined,
      userId: senderId,
      userName: senderName,
    } = useAuthStore.getState();

    if (!isLoggined || !senderId || !toUserId) {
      reject(new Error("not_logged_in"));
      return;
    }

    const conversationId = buildDmId(senderId, toUserId);
    const socket = getChatSocket();
    const { addOptimisticMessage, reconcileAck } = useChatStore.getState();

    const tempId = crypto.randomUUID().slice(0, 10);
    const optimistic: ChatMessage = {
      tempId,
      queueAt: Date.now(),
      content,
      type,
      senderId,
      senderName,
      conversationId,
      status: "pending",
    };
    addOptimisticMessage(conversationId, optimistic);

    if (!socket || !socket.connected) {
      resolve({ conversationId, tempId, status: "queued" });
      return;
    }

    socket.emit("chat:join", conversationId);
    socket.emit(
      "chat:message",
      toSendMessageDto(conversationId, tempId, content, type),
      (ack: ChatMessageDTO) => {
        reconcileAck(conversationId, tempId, {
          id: ack.id,
          timestamp: ack.timestamp,
        });
        resolve({ conversationId, tempId, status: "sent" });
      },
    );
  });
}
