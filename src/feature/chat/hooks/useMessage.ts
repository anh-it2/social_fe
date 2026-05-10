import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getChatSocket } from "../socket";
import { useCallback, useEffect, useMemo } from "react";
import { ChatMessage, HistoryInfinteData, HistoryMessagePage } from "../types";
import { useChat } from "./useChat";
import {
  ChatHistoryResponseDTO,
  ChatMessageDTO,
  MessageEditedDTO,
  MessageUnsentDTO,
  ReadReceiptDto,
} from "../dto/chat.dto";
import { useChatStore } from "../stores/chat.store";
import { toMessage, toMessages } from "../dto/chat.mapper";

export function useMessages(conversationId: string) {
  const chatSocket = getChatSocket();
  const { isConnected } = useChat(conversationId);
  const queryClient = useQueryClient();
  const { removeOptimisticMessage } = useChatStore.getState();

  const fetchHistoryMessage = useCallback(
    (cursor?: number): Promise<HistoryMessagePage> => {
      return new Promise((resolve, reject) => {
        if (!chatSocket || !isConnected)
          return reject(new Error("Can't connect to server"));

        chatSocket.emit(
          "chat:history",
          {
            conversationId,
            cursor: cursor as unknown as string,
            limit: 30 as unknown as string,
          },
          (ack: ChatHistoryResponseDTO) => {
            const messageData = toMessages(ack.messages);

            const cur = useChatStore.getState().getReadCursor(conversationId);
            if (cur === -1) {
              resolve({
                messages: messageData,
                nextCursor: ack.nextCurosr,
                hasMore: ack.hasMore,
              });
              return;
            }

            let changed = false;
            const messages = messageData.map((msg) => {
              if (
                msg.seq !== undefined &&
                msg.seq <= cur &&
                msg.status !== "read"
              ) {
                changed = true;
                return { ...msg, status: "read" as const };
              }
              return msg;
            });

            resolve({
              messages: changed ? messages : messageData,
              nextCursor: ack.nextCurosr,
              hasMore: ack.hasMore,
            });
          },
        );
      });
    },
    [conversationId, chatSocket, isConnected],
  );

  const {
    data: historical,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["chat:messages", conversationId],
    queryFn: ({ pageParam }) => fetchHistoryMessage(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: isConnected && !!conversationId,

    // flatten newest-first: page[0] is newest, within a page newest-first too
    select: (raw): ChatMessage[] => {
      const seen = new Set<string>();
      const flat: ChatMessage[] = [];
      for (const page of raw.pages) {
        for (const msg of page.messages) {
          if (msg.id) {
            if (seen.has(msg.id)) continue;
            seen.add(msg.id);
            flat.push(msg);
          }
        }
      }
      return flat;
    },
  });

  useEffect(() => {
    if (!chatSocket || !conversationId || !isConnected) return;

    const handleMessage = (messageDTO: ChatMessageDTO) => {
      if (messageDTO.conversationId !== conversationId) return;

      const message = toMessage(messageDTO);

      // sender side: drop optimistic copy
      if (messageDTO.tempId) {
        removeOptimisticMessage(conversationId, {
          tempId: messageDTO.tempId,
          id: messageDTO.id,
        });
      }

      const cur = useChatStore.getState().getReadCursor(conversationId);
      if (
        message.seq !== undefined &&
        message.seq <= cur &&
        message.status !== "read"
      ) {
        message.status = "read";
      }

      queryClient.setQueryData<HistoryInfinteData>(
        ["chat:messages", conversationId],
        (old) => {
          if (!old || old.pages.length === 0) {
            return {
              pages: [
                {
                  messages: [message],
                  nextCursor: undefined,
                  hasMore: false,
                },
              ],
              pageParams: [undefined],
            };
          }

          const firstPage = old.pages[0];
          if (firstPage.messages.some((msg) => msg.id === message.id))
            return old;

          return {
            ...old,
            pages: [
              { ...firstPage, messages: [message, ...firstPage.messages] },
              ...old.pages.slice(1),
            ],
          };
        },
      );
    };

    const handleRead = (dto: ReadReceiptDto) => {
      if (dto.conversationId !== conversationId) return;

      queryClient.setQueryData<HistoryInfinteData>(
        ["chat:messages", conversationId],
        (old) => {
          if (!old) return old;

          const currentCursor = useChatStore
            .getState()
            .getReadCursor(conversationId);

          if (dto.upToSeq <= currentCursor) return old;

          useChatStore.getState().setReadCursor(conversationId, dto.upToSeq);

          let changed = false;
          const pages = old.pages.map((page) => {
            const messages = page.messages.map((msg) => {
              if (
                msg.seq !== undefined &&
                msg.seq <= dto.upToSeq &&
                msg.status !== "read"
              ) {
                changed = true;
                return { ...msg, status: "read" as const };
              }
              return msg;
            });
            return { ...page, messages };
          });
          return changed ? { ...old, pages } : old;
        },
      );
    };

    const handleEdited = (dto: MessageEditedDTO) => {
      if (dto.conversationId !== conversationId) return;
      useChatStore
        .getState()
        .applyEditToOptimistic(
          conversationId,
          dto.messageId,
          dto.content,
          dto.editedAt,
        );
      queryClient.setQueryData<HistoryInfinteData>(
        ["chat:messages", conversationId],
        (old) => {
          if (!old) return old;
          let changed = false;
          const pages = old.pages.map((page) => {
            const messages = page.messages.map((msg) => {
              if (msg.id === dto.messageId) {
                changed = true;
                return { ...msg, content: dto.content, editedAt: dto.editedAt };
              }
              return msg;
            });
            return { ...page, messages };
          });
          return changed ? { ...old, pages } : old;
        },
      );
    };

    const handleUnsent = (dto: MessageUnsentDTO) => {
      console.log("[chat] received chat:unsent", dto);
      if (dto.conversationId !== conversationId) return;
      useChatStore
        .getState()
        .applyDeletedToOptimistic(conversationId, dto.messageId);
      queryClient.setQueryData<HistoryInfinteData>(
        ["chat:messages", conversationId],
        (old) => {
          if (!old) return old;
          let changed = false;
          const pages = old.pages.map((page) => {
            const messages = page.messages.map((msg) => {
              if (msg.id === dto.messageId) {
                changed = true;
                return { ...msg, content: "", deleted: true };
              }
              return msg;
            });
            return { ...page, messages };
          });
          return changed ? { ...old, pages } : old;
        },
      );
    };

    chatSocket.on("chat:message", handleMessage);
    chatSocket.on("chat:read", handleRead);
    chatSocket.on("chat:edited", handleEdited);
    chatSocket.on("chat:unsent", handleUnsent);

    return () => {
      chatSocket.off("chat:message", handleMessage);
      chatSocket.off("chat:read", handleRead);
      chatSocket.off("chat:edited", handleEdited);
      chatSocket.off("chat:unsent", handleUnsent);
    };
  }, [chatSocket, conversationId, isConnected, queryClient]);

  // per-conversation selector — avoid re-render on unrelated conv changes
  const optimisticForConv = useChatStore(
    (state) => state.optimisticMessages[conversationId],
  );

  const combined = useMemo(() => {
    const base = historical || [];
    if (!optimisticForConv || optimisticForConv.length === 0) return base;

    const historicalIds = new Set<string>();
    for (const m of base) {
      if (m.id) historicalIds.add(m.id);
    }

    // keep optimistics NOT yet in historical (still pending or just acked)
    const liveOptimistics = optimisticForConv.filter(
      (m) => !m.id || !historicalIds.has(m.id),
    );

    if (liveOptimistics.length === 0) return base;

    // historical is newest-first; optimistics are oldest-of-pending → newest
    // prepend optimistics so newest pending sits at top
    return [...liveOptimistics.reverse(), ...base];
  }, [optimisticForConv, historical]);

  return {
    messages: combined,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
  };
}
