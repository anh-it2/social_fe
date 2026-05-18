"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useFriendIdSet } from "@/feature/friends/hooks/useFriends";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import type { GroupInfo } from "../../../stores/chat.store.type";
import { buildChatEntries, sortChatEntries } from "../../../lib/conversationSort";
import { useSidebarFilterStore } from "../../../stores/sidebar-filter.store";
import type { SelectedConversation } from "../../../types/conversation";
import { ConversationItem } from "./ConversationItem";

const { Text } = Typography;

export interface ConversationEntry {
  user: OnlineUserDto;
  online: boolean;
}

interface ConversationListProps {
  contacts: ConversationEntry[];
  groups: GroupInfo[];
  selectedId: string | null;
  currentUserName: string;
  myId: string;
  myName: string;
  onSelect: (selection: SelectedConversation) => void;
  unreadMap?: Record<string, boolean>;
}

export function ConversationList({
  contacts,
  groups,
  selectedId,
  currentUserName,
  myId,
  myName,
  onSelect,
  unreadMap,
}: ConversationListProps) {
  const t = useTranslations("Chat.sidebar");
  const filter = useSidebarFilterStore((s) => s.active);
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const lastActivity = useChatRoomUnreadStore((s) => s.lastActivity);
  const friendIds = useFriendIdSet();

  const { visibleGroups, visibleContacts } = useMemo(() => {
    switch (filter) {
      case "filterGroups":
        return { visibleGroups: groups, visibleContacts: [] };
      case "filterUnread":
        return {
          visibleGroups: groups.filter((g) => !!unreadMap?.[g.conversationId]),
          visibleContacts: contacts.filter((c) => !!unreadMap?.[c.user.id]),
        };
      case "filterRequests":
        return { visibleGroups: [], visibleContacts: [] };
      case "filterAll":
      default:
        return { visibleGroups: groups, visibleContacts: contacts };
    }
  }, [filter, groups, contacts, unreadMap]);

  const sortedEntries = useMemo(() => {
    const onlineUserIds = new Set(onlineUsers.map((u) => u.id));
    const entries = buildChatEntries(visibleContacts, visibleGroups, {
      onlineUserIds,
      myId,
    });
    return sortChatEntries(entries, {
      unread: unreadMap ?? {},
      lastActivity,
      friendIds,
    });
  }, [
    visibleContacts,
    visibleGroups,
    onlineUsers,
    unreadMap,
    lastActivity,
    friendIds,
    myId,
  ]);

  if (contacts.length === 0 && groups.length === 0) {
    return (
      <div className="flex-1 px-4 py-6 text-center">
        <Text className="!text-[13px] !text-[var(--color-text-muted)]">
          {t("signedInAs")}{" "}
          <Text strong className="!text-[var(--color-text)]">
            {currentUserName || t("you")}
          </Text>
          . {t("waiting")}
        </Text>
      </div>
    );
  }

  if (visibleGroups.length === 0 && visibleContacts.length === 0) {
    return (
      <div className="flex-1 px-4 py-6 text-center">
        <Text className="!text-[13px] !text-[var(--color-text-muted)]">
          {t("emptyFilter")}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-2">
      {sortedEntries.map((e) =>
        e.isGroup ? (
          <div key={e.id} className="mb-0.5">
            <ConversationItem
              kind="group"
              group={e.group}
              active={selectedId === e.id}
              unread={!!unreadMap?.[e.id]}
              myId={myId}
              myName={myName}
              onClick={() => onSelect({ kind: "group", group: e.group })}
            />
          </div>
        ) : (
          <div key={e.id} className="mb-0.5">
            <ConversationItem
              kind="dm"
              user={e.user}
              active={selectedId === e.id}
              online={e.online}
              unread={!!unreadMap?.[e.id]}
              myId={myId}
              myName={myName}
              onClick={() => onSelect({ kind: "dm", user: e.user })}
            />
          </div>
        ),
      )}
    </div>
  );
}
