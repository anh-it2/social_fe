"use client";

import { App } from "antd";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { getChatSocket } from "../socket";
import { useChatStore } from "../stores/chat.store";
import type {
  GroupCreatedDTO,
  GroupDeletedDTO,
  GroupUpdatedDTO,
} from "../dto/conversation-settings.dto";

function toGroupInfo(dto: GroupCreatedDTO) {
  return {
    conversationId: dto.conversationId,
    name: dto.name,
    memberIds: dto.memberIds,
    adminIds: dto.adminIds,
    mutedMembers: dto.mutedMembers,
    blockedMembers: dto.blockedMembers,
    createdAt: dto.createdAt,
    createdBy: dto.createdBy,
  };
}

export function useGroups() {
  const myId = useAuthStore((s) => s.userId);
  const groups = useChatStore((s) => s.groups);
  const { message } = App.useApp();
  const t = useTranslations("GroupAdmin.notifications");

  useEffect(() => {
    if (!myId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const onCreated = (dto: GroupCreatedDTO) => {
      if (!dto.memberIds.includes(myId)) {
        useChatStore.getState().removeGroup(dto.conversationId);
        return;
      }
      useChatStore.getState().upsertGroup(toGroupInfo(dto));
      socket.emit("chat:join", dto.conversationId);
    };

    const onUpdated = (dto: GroupUpdatedDTO) => {
      if (!dto.memberIds.includes(myId)) {
        useChatStore.getState().removeGroup(dto.conversationId);
        useChatRoomUnreadStore.getState().markRead(dto.conversationId);
        useChatBoxesStore.getState().closeChat(dto.conversationId);
        return;
      }
      useChatStore.getState().upsertGroup(toGroupInfo(dto));
    };

    const onDeleted = (dto: GroupDeletedDTO) => {
      useChatStore.getState().removeGroup(dto.conversationId);
      useChatRoomUnreadStore.getState().markRead(dto.conversationId);
      // close any open floating chat box for this conversation
      useChatBoxesStore.getState().closeChat(dto.conversationId);
      // toast only when the user did NOT initiate it themselves
      if (dto.reason === "dissolved") {
        message.info(t("dissolved"));
      } else if (dto.reason === "deleted") {
        message.warning(t("deletedByAdmin"));
      } else if (dto.reason === "kicked") {
        message.warning(t("youWereKicked"));
      }
    };

    socket.on("group:created", onCreated);
    socket.on("group:updated", onUpdated);
    socket.on("group:deleted", onDeleted);
    return () => {
      socket.off("group:created", onCreated);
      socket.off("group:updated", onUpdated);
      socket.off("group:deleted", onDeleted);
    };
  }, [myId, message, t]);

  useEffect(() => {
    if (!myId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const joinAll = () => {
      for (const group of Object.values(groups)) {
        if (!group.memberIds.includes(myId)) continue;
        socket.emit("chat:join", group.conversationId);
      }
    };

    if (socket.connected) joinAll();
    socket.on("connect", joinAll);
    return () => {
      socket.off("connect", joinAll);
    };
  }, [myId, groups]);
}
