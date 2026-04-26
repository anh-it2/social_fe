import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getChatSocket } from "../socket";
import { useCallback, useEffect, useMemo } from "react";
import { ChatMessage, HistoryInfinteData, HistoryMessagePage } from "../types";
import { useChat } from "./useChat";
import {
  ChatHistoryResponseDTO,
  ChatMessageDTO,
  ReadReceiptDto,
} from "../dto/chat.dto";
import { useChatStore } from "../stores/chat.store";
import { toMessage, toMessages } from "../dto/chat.mapper";

export function useMessages(conversationId: string) {
  const chatSocket = getChatSocket();
  const { isConnected } = useChat(conversationId);
  const queryClient = useQueryClient();
  const { removeOptimisticMessage, updateStatus } = useChatStore.getState();

  //use useCallback to increase performance
  const fetchHistoryMessage = useCallback(
    (cursor?: number): Promise<HistoryMessagePage> => {
      return new Promise((resolve, reject) => {
        if (!chatSocket || !isConnected)
          return reject(new Error("Can't connect to server"));

        chatSocket.emit(
          "chat:history",
          {
            conversationId,
            cursor: cursor,
            limit: 30,
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
                return {
                  ...msg,
                  status: "read" as const,
                };
              }
              return msg;
            });

            //do such as this to decrease how many react re render
            //react re render base on ref
            if (!changed) {
              resolve({
                messages: messageData,
                nextCursor: ack.nextCurosr,
                hasMore: ack.hasMore,
              });
              return;
            }

            resolve({
              messages: messages,
              nextCursor: ack.nextCurosr,
              hasMore: ack.hasMore,
            });
          },
        );
      });
    },
    [conversationId],
  );

  const {
    data: historical,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [conversationId, "chat:messages"],
    queryFn: ({ pageParam }) => fetchHistoryMessage(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: isConnected,

    //tranform raw data into history data array
    //this only work when the ref change => prevent rework between re render
    select: (raw): ChatMessage[] => {
      const seen = new Set<string>();
      const flat: ChatMessage[] = [];
      for (let i = raw.pages.length - 1; i >= 0; i--) {
        for (const msg of raw.pages[i].messages) {
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

      if (messageDTO.tempId) {
        removeOptimisticMessage(conversationId, {
          tempId: messageDTO.tempId,
          id: messageDTO.id,
        });

        let message = toMessage(messageDTO);

        const cur = useChatStore.getState().getReadCursor(conversationId);
        if (
          message.seq !== undefined &&
          message.seq <= cur &&
          message.status !== "read"
        ) {
          message.status = "read";
        }

        queryClient.setQueryData<HistoryInfinteData>(
          [conversationId, "chat:messages"],
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

            const newMessageArray = [message, ...firstPage.messages];

            return {
              ...old,
              pages: [
                {
                  ...firstPage,
                  messages: newMessageArray,
                },
                ...old.pages.slice(1),
              ],
            };
          },
        );
      }
    };
    const handleRead = (dto: ReadReceiptDto) => {
      if (dto.conversationId !== conversationId) return;

      queryClient.setQueryData<HistoryInfinteData>(
        [conversationId, "chat:messages"],
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

    chatSocket.on("chat:message", handleMessage);
    chatSocket.on("chat:read", handleRead);

    return () => {
      chatSocket.off("chat:message", handleMessage);
      chatSocket.off("chat:read", handleRead);
    };
  }, [chatSocket, conversationId, isConnected, queryClient]);

  const optimisticMessages = useChatStore((state) => state.optimisticMessages);

  const conbine = useMemo(() => {
    if (!optimisticMessages || optimisticMessages[conversationId].length === 0)
      return historical;

    const historicalIds = new Set<string>();

    for (const m of historical || []) {
      if (m.id) {
        historicalIds.add(m.id);
      }
    }

    const liveOptimistics = optimisticMessages[conversationId].filter(
      (message) => message.id && historicalIds.has(message.id),
    );

    if (liveOptimistics.length === 0) return historical || [];

    return [...(historical || []), ...liveOptimistics];
  }, [optimisticMessages, historical]);

  return {
    messages: conbine,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
  };
}
