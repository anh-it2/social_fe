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
    const connected = Boolean(socket && socket.connected);

    const tempId = crypto.randomUUID().slice(0, 10);
    // If socket is connected we emit right now, so the optimistic record is
    // marked "sent" up-front. This prevents `useChat`'s flush-pending effect
    // (which scans for status === "pending") from re-emitting this message
    // when a ChatMain mounts shortly after (e.g. via openChat) and the ack
    // hasn't returned yet — that race produced duplicate messages.
    const optimistic: ChatMessage = {
      tempId,
      queueAt: Date.now(),
      content,
      type,
      senderId,
      senderName,
      conversationId,
      status: connected ? "sent" : "pending",
    };
    addOptimisticMessage(conversationId, optimistic);

    if (!connected || !socket) {
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
