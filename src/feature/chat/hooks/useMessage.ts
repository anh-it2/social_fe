import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getChatSocket } from "../socket";
import { useCallback, useEffect, useMemo } from "react";
import { ChatMessage, HistoryInfinteData, HistoryMessagePage } from "../types";
import { useChat } from "./useChat";
import {
  ChatMessageDTO,
  MessageEditedDTO,
  MessageUnpinnedBroadcastDTO,
  MessageUnsentDTO,
  PinnedMessageDTO,
  PinnedReplayDTO,
  ReactionAck,
  ReactionBroadcastDTO,
  ReadReceiptDto,
} from "../dto/chat.dto";
import { useChatStore } from "../stores/chat.store";
import { toMessage, toMessages } from "../dto/chat.mapper";
import { isBlockMarker, parseBlockMarker } from "../lib/blockMarker";
import { applyReaction } from "../lib/reactions";
import type { MessageReaction, ReactionKey } from "../types";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getMessagesService } from "../services/getMessages.service";

/** Replace the reactions array of one message (by id) in the query cache. */
function patchReactions(
  data: HistoryInfinteData | undefined,
  messageId: string,
  next: MessageReaction[],
): HistoryInfinteData | undefined {
  if (!data) return data;
  let changed = false;
  const pages = data.pages.map((page) => {
    const messages = page.messages.map((msg) => {
      if (msg.id === messageId) {
        changed = true;
        return { ...msg, reactions: next };
      }
      return msg;
    });
    return { ...page, messages };
  });
  return changed ? { ...data, pages } : data;
}

export function useMessages(conversationId: string) {
  const chatSocket = getChatSocket();
  const { isConnected } = useChat(conversationId);
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const queryClient = useQueryClient();
  const { removeOptimisticMessage } = useChatStore.getState();

  const fetchHistoryMessage = useCallback(
    async (cursor?: number): Promise<HistoryMessagePage> => {
      // History now comes from social-platform-be over REST (not the socket).
      // Socket still feeds live updates via the listeners below.
      const ack = await getMessagesService(conversationId, cursor, 30);

      const myId = useAuthStore.getState().userId;
      let latestPeerBlock:
        | { senderId: string; on: boolean; seq: number }
        | null = null;
      const filtered = ack.messages.filter((dto) => {
        if (!isBlockMarker(dto.content)) return true;
        if (dto.senderId !== myId) {
          const on = parseBlockMarker(dto.content) ?? false;
          const seq = dto.seq ?? 0;
          if (!latestPeerBlock || seq >= latestPeerBlock.seq) {
            latestPeerBlock = { senderId: dto.senderId, on, seq };
          }
        }
        return false;
      });
      if (latestPeerBlock) {
        const s: { senderId: string; on: boolean } = latestPeerBlock;
        useChatStore.getState().setBlockedBy(s.senderId, s.on);
      }
      const messageData = toMessages(filtered);

      const cur = useChatStore.getState().getReadCursor(conversationId);
      if (cur === -1) {
        return {
          messages: messageData,
          nextCursor: ack.nextCurosr ?? undefined,
          hasMore: ack.hasMore,
        };
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

      return {
        messages: changed ? messages : messageData,
        nextCursor: ack.nextCurosr ?? undefined,
        hasMore: ack.hasMore,
      };
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
    queryKey: ["chat:messages", conversationId],
    queryFn: ({ pageParam }) => fetchHistoryMessage(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!conversationId && isLoggined,
    // global staleTime is 30s; while a conversation is closed its socket
    // listeners are gone, so reactions/edits/unsends made meanwhile are
    // missed. Re-fetch history on every (re)open to resync server truth.
    staleTime: 0,
    refetchOnMount: "always",

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

      const myId = useAuthStore.getState().userId;
      const blockSignal = parseBlockMarker(messageDTO.content);
      if (blockSignal !== null) {
        if (messageDTO.senderId !== myId) {
          useChatStore.getState().setBlockedBy(messageDTO.senderId, blockSignal);
        }
        return;
      }

      if (useChatStore.getState().isBlocked(messageDTO.senderId)) return;

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

    const handleReacted = (dto: ReactionBroadcastDTO) => {
      if (dto.conversationId !== conversationId) return;
      queryClient.setQueryData<HistoryInfinteData>(
        ["chat:messages", conversationId],
        (old) => {
          if (!old) return old;
          // find current reactions for this message, then apply the change
          let cur: MessageReaction[] | undefined;
          for (const page of old.pages) {
            const hit = page.messages.find((m) => m.id === dto.messageId);
            if (hit) {
              cur = hit.reactions;
              break;
            }
          }
          const next = applyReaction(
            cur,
            dto.userId,
            dto.userName,
            dto.emoji,
          );
          return patchReactions(old, dto.messageId, next);
        },
      );
    };

    const handlePinned = (dto: PinnedMessageDTO) => {
      if (dto.conversationId !== conversationId) return;
      useChatStore.getState().pinMessage(conversationId, {
        id: dto.id,
        content: dto.content,
        type: dto.type,
        senderId: dto.senderId,
        senderName: dto.senderName,
        pinnedAt: dto.pinnedAt,
        pinnedBy: dto.pinnedBy,
      });
    };

    const handleUnpinned = (dto: MessageUnpinnedBroadcastDTO) => {
      if (dto.conversationId !== conversationId) return;
      useChatStore.getState().unpinMessage(conversationId, dto.messageId);
    };

    const handlePinsReplay = (dto: PinnedReplayDTO) => {
      if (dto.conversationId !== conversationId) return;
      // simplest sync: unpin everything currently held for this conv, then pin server's list
      const store = useChatStore.getState();
      const current = store.getPinned(conversationId);
      for (const p of current) store.unpinMessage(conversationId, p.id);
      for (const p of dto.pinned) {
        store.pinMessage(conversationId, {
          id: p.id,
          content: p.content,
          type: p.type,
          senderId: p.senderId,
          senderName: p.senderName,
          pinnedAt: p.pinnedAt,
          pinnedBy: p.pinnedBy,
        });
      }
    };

    chatSocket.on("chat:message", handleMessage);
    chatSocket.on("chat:read", handleRead);
    chatSocket.on("chat:edited", handleEdited);
    chatSocket.on("chat:unsent", handleUnsent);
    chatSocket.on("chat:pinned", handlePinned);
    chatSocket.on("chat:unpinned", handleUnpinned);
    chatSocket.on("chat:pins-replay", handlePinsReplay);
    chatSocket.on("chat:reacted", handleReacted);

    // request authoritative pin list when entering a conversation
    chatSocket.emit(
      "chat:pins-fetch",
      { conversationId },
      handlePinsReplay,
    );

    return () => {
      chatSocket.off("chat:message", handleMessage);
      chatSocket.off("chat:read", handleRead);
      chatSocket.off("chat:edited", handleEdited);
      chatSocket.off("chat:unsent", handleUnsent);
      chatSocket.off("chat:pinned", handlePinned);
      chatSocket.off("chat:unpinned", handleUnpinned);
      chatSocket.off("chat:pins-replay", handlePinsReplay);
      chatSocket.off("chat:reacted", handleReacted);
    };
  }, [chatSocket, conversationId, isConnected, queryClient]);

  // toggle/replace the current user's reaction on a message.
  // emoji = null removes it. Optimistic: patch cache, rollback if NAK.
  const reactMessage = useCallback(
    (messageId: string, emoji: ReactionKey | null) => {
      if (!chatSocket) return;
      const { userId: myId, userName: myName } = useAuthStore.getState();
      if (!myId) return;

      let prev: MessageReaction[] | undefined;
      queryClient.setQueryData<HistoryInfinteData>(
        ["chat:messages", conversationId],
        (old) => {
          if (!old) return old;
          for (const page of old.pages) {
            const hit = page.messages.find((m) => m.id === messageId);
            if (hit) {
              prev = hit.reactions;
              break;
            }
          }
          const next = applyReaction(prev, myId, myName, emoji);
          return patchReactions(old, messageId, next);
        },
      );

      if (!chatSocket.connected) return;
      chatSocket.emit(
        "chat:react",
        { conversationId, messageId, emoji },
        (ack: ReactionAck) => {
          if (ack.ok) return;
          // rollback to the pre-optimistic snapshot
          queryClient.setQueryData<HistoryInfinteData>(
            ["chat:messages", conversationId],
            (old) => patchReactions(old, messageId, prev ?? []),
          );
        },
      );
    },
    [chatSocket, conversationId, queryClient],
  );

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
    reactMessage,
  };
}
