import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getChatSocket } from "../socket";
import { useCallback, useEffect, useState } from "react";
import { useChatStore } from "../stores/chat.store";
import { toSendMessageDto } from "../dto/chat.mapper";
import { ChatMessageDTO } from "../dto/chat.dto";
import { ChatMessage } from "../types";

export function useChat(conversationId: string) {
  const { isLoggined, userId: senderId, userName: senderName } = useAuthStore();
  const chatSocket = getChatSocket();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const {
    getPending,
    getOptimisticMessages,
    reconclieAck,
    addOptimisticMessage,
  } = useChatStore.getState();

  const checkCondition = () => !isLoggined || !conversationId || !chatSocket;

  //checking the state of connection
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

  //join and leave room
  useEffect(() => {
    if (checkCondition()) return;

    chatSocket.emit("chat:join", conversationId);

    return () => {
      chatSocket.emit("chat:leave", conversationId);
    };
  }, [conversationId, isConnected, chatSocket]);

  //flush pending message
  useEffect(() => {
    if (checkCondition()) return;

    const pending = getPending(conversationId);

    for (const p of pending) {
      chatSocket.emit(
        "chat:message",
        toSendMessageDto(conversationId, p.tempId, p.content, p.type),
        (ack: ChatMessageDTO) => {
          reconclieAck(conversationId, p.tempId, {
            id: ack.id,
            timestamp: ack.timestamp,
          });
        },
      );
    }
  }, [conversationId, isConnected, chatSocket]);

  const sendMessage = useCallback(
    (content: string, type: ChatMessage["type"]) => {
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
          ),
          (ack: ChatMessageDTO) => {
            reconclieAck(conversationId, optimisticMessage.tempId, {
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

  const retryMessage = useCallback(
    (tempId: string) => {
      return new Promise((resolve, reject) => {
        const msg = getOptimisticMessages(conversationId).find(
          (item) => item.tempId === tempId,
        );

        if (!chatSocket || !isConnected) {
          return reject(new Error("Not connected — message queued"));
        }

        if (!msg) {
          return reject(new Error("doesn't exist message"));
        }

        chatSocket.emit(
          "chat:message",
          toSendMessageDto(conversationId, msg.tempId, msg.content, msg.type),
          (ack: ChatMessageDTO) =>
            reconclieAck(conversationId, msg.tempId, {
              id: ack.id,
              timestamp: ack.timestamp,
            }),
        );
      });
    },
    [conversationId, chatSocket, isConnected],
  );

  return {
    sendMessage,
    retryMessage,
    isConnected,
  };
}
