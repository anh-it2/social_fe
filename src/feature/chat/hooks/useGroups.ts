"use client";

import { App } from "antd";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
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
import { getMyGroupsService } from "../services/groupChat.service";

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
  const { data: serverGroups } = useQuery({
    queryKey: ["chat:groups", myId],
    queryFn: getMyGroupsService,
    enabled: !!myId,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!serverGroups) return;
    const store = useChatStore.getState();
    const serverIds = new Set(serverGroups.map((group) => group.conversationId));
    for (const group of serverGroups) store.upsertGroup(group);
    for (const group of Object.values(store.groups)) {
      if (group.memberIds.includes(myId) && !serverIds.has(group.conversationId)) {
        store.removeGroup(group.conversationId);
      }
    }
  }, [serverGroups, myId]);

  useEffect(() => {
    if (!myId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const onCreated = (dto: GroupCreatedDTO) => {
      useChatStore.getState().upsertGroup(toGroupInfo(dto));
      socket.emit("chat:join", dto.conversationId);
    };

    const onUpdated = (dto: GroupUpdatedDTO) => {
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
      for (const conv of Object.keys(groups)) {
        socket.emit("chat:join", conv);
      }
    };

    if (socket.connected) joinAll();
    socket.on("connect", joinAll);
    return () => {
      socket.off("connect", joinAll);
    };
  }, [myId, groups]);
}
