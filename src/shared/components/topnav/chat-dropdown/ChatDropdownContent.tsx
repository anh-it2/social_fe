"use client";

import { Flex, Input, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { useNavigation } from "@/shared/hooks/useNavigation";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { pickGradient } from "@/feature/chat/lib/avatar";
import {
  buildChatEntries,
  sortChatEntries,
} from "@/feature/chat/lib/conversationSort";
import { useChatStore } from "@/feature/chat/stores/chat.store";
import type { GroupInfo } from "@/feature/chat/stores/chat.store.type";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { DropdownTabs, type DropdownTabKey } from "../DropdownTabs";
import { ChatDropdownFooter } from "./ChatDropdownFooter";
import { ChatDropdownHeader } from "./ChatDropdownHeader";
import { ChatDropdownItem } from "./ChatDropdownItem";

const { Text } = Typography;

interface ChatDropdownContentProps {
  onClose: () => void;
  onCreateGroup: () => void;
}

interface ContactEntry {
  user: OnlineUserDto;
  online: boolean;
}


export function ChatDropdownContent({ onClose, onCreateGroup }: ChatDropdownContentProps) {
  const t = useTranslations("Topnav.chat");
  const nav = useNavigation();
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const selfId = useAuthStore((s) => s.userId);
  const groupsMap = useChatStore((s) => s.groups);
  const openChat = useChatBoxesStore((s) => s.openChat);
  const unreadMap = useChatRoomUnreadStore((s) => s.unread);
  const kindMap = useChatRoomUnreadStore((s) => s.kind);
  const lastActivity = useChatRoomUnreadStore((s) => s.lastActivity);
  const markRead = useChatRoomUnreadStore((s) => s.markRead);
  const [tab, setTab] = useState<DropdownTabKey>("all");
  const [query, setQuery] = useState("");

  function handleGroupClick(group: GroupInfo) {
    markRead(group.conversationId);
    openChat({
      id: group.conversationId,
      name: group.name,
      lastMessage: "",
      time: "",
      online: false,
      gradient: pickGradient(group.conversationId),
      kind: "group",
    });
    onClose();
  }

  function handleItemClick(entry: ContactEntry) {
    markRead(entry.user.id);
    openChat({
      id: entry.user.id,
      name: entry.user.name,
      lastMessage: "",
      time: "",
      online: entry.online,
      gradient: pickGradient(entry.user.id),
    });
    onClose();
  }

  // Header's "new chat" picker still works off the plain contact list.
  const contacts = useMemo<ContactEntry[]>(() => {
    const onlineIds = new Set(onlineUsers.map((u) => u.id));
    return knownUsers
      .map((u) => ({ user: u, online: onlineIds.has(u.id) }))
      .sort(
        (a, b) =>
          (lastActivity[b.user.id] ?? 0) - (lastActivity[a.user.id] ?? 0) ||
          Number(b.online) - Number(a.online),
      );
  }, [onlineUsers, knownUsers, lastActivity]);

  // Unified, sorted chat list (users + groups) — shared with the chat page.
  const visibleEntries = useMemo(() => {
    const onlineUserIds = new Set(onlineUsers.map((u) => u.id));
    const entries = buildChatEntries(
      knownUsers.map((u) => ({ user: u, online: onlineUserIds.has(u.id) })),
      Object.values(groupsMap),
      { onlineUserIds, myId: selfId },
    );

    const q = query.trim().toLowerCase();
    const filtered = entries.filter((e) => {
      if (tab === "unread" && !unreadMap[e.id]) return false;
      if (tab === "read" && unreadMap[e.id]) return false;
      if (q && !e.name.toLowerCase().includes(q)) return false;
      return true;
    });

    return sortChatEntries(filtered, { unread: unreadMap, lastActivity });
  }, [
    knownUsers,
    onlineUsers,
    groupsMap,
    selfId,
    unreadMap,
    lastActivity,
    tab,
    query,
  ]);

  const tabLabels = {
    all: t("tabs.all"),
    unread: t("tabs.unread"),
    read: t("tabs.read"),
  };

  function goSeeAll() {
    nav.push("/chat");
    onClose();
  }

  return (
    <Flex
      vertical
      className="!w-[min(360px,calc(100vw-16px))] bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[14px] [box-shadow:0_12px_32px_rgba(0,0,0,0.5)] [overflow:hidden]"  >
      <ChatDropdownHeader
        contacts={contacts}
        onExpand={goSeeAll}
        onPickUser={handleItemClick}
        onCreateGroup={onCreateGroup}
      />
      <div className="!w-full [padding:0_12px_8px_12px]" >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          prefix={
            <Icon
              name="search"
              size={16}
              color="var(--color-text-placeholder)"
            />
          }
          allowClear
          variant="filled"
          className="!h-9 !rounded-full !bg-[var(--color-bg-tertiary)] [&_input]:!bg-transparent [&_input]:!text-[14px] [&_input]:!text-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)]"
        />
      </div>
      <DropdownTabs value={tab} onChange={setTab} labels={tabLabels} />
      <Flex
        vertical
        gap={2}
        className="!w-full [padding:4px_8px_8px_8px] max-h-[420px] [overflow-y:auto]"  >
        {visibleEntries.length === 0 ? (
          <div className="[padding:24px_12px] [text-align:center]" >
            <Text
              className="!text-[13px] text-[var(--color-text-muted)]"  >
              {query.trim()
                ? t("noResults")
                : tab === "unread"
                  ? t("noUnread")
                  : tab === "read"
                    ? t("noRead")
                    : t("noUsers")}
            </Text>
          </div>
        ) : (
          visibleEntries.map((e) => {
            const unread = !!unreadMap[e.id];
            const reaction = kindMap[e.id] === "reaction";
            const lastMessage =
              e.isGroup
                ? unread
                  ? reaction
                    ? t("newReaction")
                    : t("newMessage")
                  : t("memberCount", { count: e.group.memberIds.length })
                : unread
                  ? reaction
                    ? t("newReaction")
                    : t("newMessage")
                  : e.online
                    ? t("activeNow")
                    : t("offline");
            return (
              <ChatDropdownItem
                key={e.id}
                chat={{
                  id: e.id,
                  name: e.name,
                  lastMessage,
                  time: "",
                  online: !e.isGroup && e.online,
                  unread,
                  gradient: pickGradient(e.id),
                  avatar: e.isGroup ? undefined : e.user.avatar,
                }}
                isGroup={e.isGroup}
                onClick={() =>
                  e.isGroup
                    ? handleGroupClick(e.group)
                    : handleItemClick({ user: e.user, online: e.online })
                }
              />
            );
          })
        )}
      </Flex>
      <ChatDropdownFooter onSeeAll={goSeeAll} />
    </Flex>
  );
}
