"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import type { ChatMessageDTO, ReactionBroadcastDTO } from "../dto/chat.dto";
import { buildDmId } from "../lib/conversation";
import { parseBlockMarker } from "../lib/blockMarker";
import { getChatSocket } from "../socket";
import { useChatStore } from "../stores/chat.store";

export function useGlobalChatUnread() {
  const myId = useAuthStore((s) => s.userId);
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const joinedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!myId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const onMessage = (dto: ChatMessageDTO) => {
      if (dto.senderId === myId) return;
      const blockSignal = parseBlockMarker(dto.content);
      if (blockSignal !== null) {
        useChatStore.getState().setBlockedBy(dto.senderId, blockSignal);
        return;
      }
      if (useChatStore.getState().isBlocked(dto.senderId)) return;
      const { activePeerId, markUnread } = useChatRoomUnreadStore.getState();
      const isGroup = dto.conversationId.startsWith("group:");
      if (isGroup) {
        const group = useChatStore.getState().groups[dto.conversationId];
        if (!group?.memberIds.includes(myId)) return;
        if (dto.conversationId === activePeerId) return;
        if (useChatStore.getState().isMuted(dto.conversationId)) return;
        markUnread(dto.conversationId);
        return;
      }
      if (dto.senderId === activePeerId) return;
      const conversationId = buildDmId(myId, dto.senderId);
      if (useChatStore.getState().isMuted(conversationId)) return;
      markUnread(dto.senderId);
    };

    const onReacted = (dto: ReactionBroadcastDTO) => {
      // only announce when someone *adds* a reaction to MY message
      if (dto.emoji === null) return;
      if (dto.userId === myId) return;
      if (dto.messageOwnerId !== myId) return;
      if (useChatStore.getState().isBlocked(dto.userId)) return;

      const { activePeerId, markUnread } = useChatRoomUnreadStore.getState();
      const isGroup = dto.conversationId.startsWith("group:");
      if (isGroup) {
        const group = useChatStore.getState().groups[dto.conversationId];
        if (!group?.memberIds.includes(myId)) return;
        if (dto.conversationId === activePeerId) return;
        if (useChatStore.getState().isMuted(dto.conversationId)) return;
        markUnread(dto.conversationId, "reaction");
        return;
      }
      // DM: the reactor is the other participant in the dropdown
      if (dto.userId === activePeerId) return;
      const conversationId = buildDmId(myId, dto.userId);
      if (useChatStore.getState().isMuted(conversationId)) return;
      markUnread(dto.userId, "reaction");
    };

    const joinAll = () => {
      for (const u of onlineUsers) {
        if (u.id === myId) continue;
        const conv = buildDmId(myId, u.id);
        if (joinedRef.current.has(conv)) continue;
        socket.emit("chat:join", conv);
        joinedRef.current.add(conv);
      }
    };

    const onReconnect = () => {
      joinedRef.current.clear();
      joinAll();
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:reacted", onReacted);
    socket.on("connect", onReconnect);

    if (socket.connected) joinAll();

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:reacted", onReacted);
      socket.off("connect", onReconnect);
    };
  }, [myId, onlineUsers]);
}
