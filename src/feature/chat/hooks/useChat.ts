import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getChatSocket } from "../socket";
import { useCallback, useEffect, useState } from "react";
import { useChatStore } from "../stores/chat.store";
import { toSendMessageDto } from "../dto/chat.mapper";
import { ChatMessageDTO, MessageActionAck } from "../dto/chat.dto";
import { ChatMessage, ReplyContext } from "../types";

export function useChat(conversationId: string) {
  const { isLoggined, userId: senderId, userName: senderName } = useAuthStore();
  const chatSocket = getChatSocket();
  const [isConnected, setIsConnected] = useState<boolean>(
    chatSocket?.connected ?? false,
  );
  const {
    getPending,
    getOptimisticMessages,
    reconcileAck,
    addOptimisticMessage,
    markFailed,
  } = useChatStore.getState();

  const checkCondition = () => !isLoggined || !conversationId || !chatSocket;

  useEffect(() => {
    if (checkCondition()) return;

    const onConnected = () => setIsConnected(true);
    const onDisConnected = () => setIsConnected(false);

    chatSocket.on("connect", onConnected);
    chatSocket.on("disconnect", onDisConnected);

    return () => {
      chatSocket.off("connect", onConnected);
      chatSocket.off("disconnect", onDisConnected);
    };
  }, [isLoggined, conversationId, chatSocket]);

  // join on connect, re-join on every reconnect
  useEffect(() => {
    if (checkCondition()) return;

    const join = () => chatSocket.emit("chat:join", conversationId);

    if (chatSocket.connected) join();
    chatSocket.on("connect", join);

    return () => {
      chatSocket.off("connect", join);
      if (chatSocket.connected) chatSocket.emit("chat:leave", conversationId);
    };
  }, [conversationId, chatSocket, isLoggined]);

  // flush pending after connect
  useEffect(() => {
    if (checkCondition() || !isConnected) return;

    const pending = getPending(conversationId);

    for (const p of pending) {
      chatSocket.emit(
        "chat:message",
        toSendMessageDto(conversationId, p.tempId, p.content, p.type),
        (ack: ChatMessageDTO) => {
          reconcileAck(conversationId, p.tempId, {
            id: ack.id,
            timestamp: ack.timestamp,
          });
        },
      );
    }
  }, [conversationId, isConnected, chatSocket]);

  const sendMessage = useCallback(
    (
      content: string,
      type: ChatMessage["type"],
      replyTo?: ReplyContext,
    ) => {
      return new Promise<void>((resolve, reject) => {
        const tempId = crypto.randomUUID().slice(0, 10);
        const queueAt = Date.now();

        const optimisticMessage: ChatMessage = {
          tempId,
          queueAt,
          content,
          type,
          senderId,
          senderName,
          conversationId,
          status: "pending",
          replyTo,
        };

        addOptimisticMessage(conversationId, optimisticMessage);

        if (!chatSocket || !isConnected) {
          return reject(new Error("Not connected — message queued"));
        }

        chatSocket.emit(
          "chat:message",
          toSendMessageDto(
            conversationId,
            optimisticMessage.tempId,
            optimisticMessage.content,
            optimisticMessage.type,
            replyTo,
          ),
          (ack: ChatMessageDTO) => {
            reconcileAck(conversationId, optimisticMessage.tempId, {
              id: ack.id,
              timestamp: ack.timestamp,
            });

            resolve();
          },
        );
      });
    },
    [conversationId, senderId, senderName, chatSocket, isConnected],
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!chatSocket || !isConnected) {
          return reject(new Error("Not connected"));
        }
        chatSocket.emit(
          "chat:edit",
          { conversationId, messageId, content },
          (ack: MessageActionAck) => {
            if (ack.ok) resolve();
            else reject(new Error(ack.error || "edit_failed"));
          },
        );
      });
    },
    [conversationId, chatSocket, isConnected],
  );

  const unsendMessage = useCallback(
    (messageId: string) => {
      return new Promise<void>((resolve, reject) => {
        console.log("[chat] unsend emit", { conversationId, messageId, isConnected });
        if (!chatSocket || !isConnected) {
          return reject(new Error("Not connected"));
        }
        chatSocket.emit(
          "chat:unsend",
          { conversationId, messageId },
          (ack: MessageActionAck) => {
            console.log("[chat] unsend ack", ack);
            if (ack.ok) resolve();
            else reject(new Error(ack.error || "unsend_failed"));
          },
        );
      });
    },
    [conversationId, chatSocket, isConnected],
  );

  const retryMessage = useCallback(
    (tempId: string) => {
      return new Promise<void>((resolve, reject) => {
        const msg = getOptimisticMessages(conversationId).find(
          (item) => item.tempId === tempId,
        );

        if (!msg) {
          return reject(new Error("Message not found"));
        }

        if (!chatSocket || !isConnected) {
          markFailed(conversationId, tempId);
          return reject(new Error("Not connected — message queued"));
        }

        chatSocket.emit(
          "chat:message",
          toSendMessageDto(conversationId, msg.tempId, msg.content, msg.type),
          (ack: ChatMessageDTO) => {
            reconcileAck(conversationId, msg.tempId, {
              id: ack.id,
              timestamp: ack.timestamp,
            });
            resolve();
          },
        );
      });
    },
    [conversationId, chatSocket, isConnected],
  );

  return {
    sendMessage,
    retryMessage,
    editMessage,
    unsendMessage,
    isConnected,
  };
}
