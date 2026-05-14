"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import type { GroupInfo } from "../../../stores/chat.store.type";
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
      {visibleGroups.map((g) => (
        <div key={g.conversationId} className="mb-0.5">
          <ConversationItem
            kind="group"
            group={g}
            active={selectedId === g.conversationId}
            unread={!!unreadMap?.[g.conversationId]}
            myId={myId}
            myName={myName}
            onClick={() => onSelect({ kind: "group", group: g })}
          />
        </div>
      ))}
      {visibleContacts.map((c) => (
        <div key={c.user.id} className="mb-0.5">
          <ConversationItem
            kind="dm"
            user={c.user}
            active={selectedId === c.user.id}
            online={c.online}
            unread={!!unreadMap?.[c.user.id]}
            myId={myId}
            myName={myName}
            onClick={() => onSelect({ kind: "dm", user: c.user })}
          />
        </div>
      ))}
    </div>
  );
}
