"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useNavigation } from "@/shared/hooks/useNavigation";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { DropdownTabs, type DropdownTabKey } from "../DropdownTabs";
import { ChatDropdownFooter } from "./ChatDropdownFooter";
import { ChatDropdownHeader } from "./ChatDropdownHeader";
import { ChatDropdownItem } from "./ChatDropdownItem";

const { Text } = Typography;

interface ChatDropdownContentProps {
  onClose: () => void;
}

interface ContactEntry {
  user: OnlineUserDto;
  online: boolean;
}

export function ChatDropdownContent({ onClose }: ChatDropdownContentProps) {
  const t = useTranslations("Topnav.chat");
  const nav = useNavigation();
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const openChat = useChatBoxesStore((s) => s.openChat);
  const unreadMap = useChatRoomUnreadStore((s) => s.unread);
  const markRead = useChatRoomUnreadStore((s) => s.markRead);
  const [tab, setTab] = useState<DropdownTabKey>("all");

  const contacts = useMemo<ContactEntry[]>(() => {
    const onlineIds = new Set(onlineUsers.map((u) => u.id));
    return knownUsers
      .map((u) => ({ user: u, online: onlineIds.has(u.id) }))
      .sort((a, b) => Number(b.online) - Number(a.online));
  }, [onlineUsers, knownUsers]);

  const visibleContacts = useMemo(() => {
    if (tab === "all") return contacts;
    return contacts.filter((c) =>
      tab === "unread" ? !!unreadMap[c.user.id] : !unreadMap[c.user.id],
    );
  }, [contacts, unreadMap, tab]);

  const tabLabels = {
    all: t("tabs.all"),
    unread: t("tabs.unread"),
    read: t("tabs.read"),
  };

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

  function goSeeAll() {
    nav.push("/chat");
    onClose();
  }

  return (
    <Flex
      vertical
      className="!w-[min(360px,calc(100vw-16px))]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <ChatDropdownHeader
        contacts={contacts}
        onExpand={goSeeAll}
        onPickUser={handleItemClick}
      />
      <DropdownTabs value={tab} onChange={setTab} labels={tabLabels} />
      <Flex
        vertical
        gap={2}
        className="!w-full"
        style={{
          padding: "4px 8px 8px 8px",
          maxHeight: 420,
          overflowY: "auto",
        }}
      >
        {visibleContacts.length === 0 ? (
          <div style={{ padding: "24px 12px", textAlign: "center" }}>
            <Text
              className="!text-[13px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {tab === "unread"
                ? t("noUnread")
                : tab === "read"
                  ? t("noRead")
                  : t("noUsers")}
            </Text>
          </div>
        ) : (
          visibleContacts.map((c) => {
            const unread = !!unreadMap[c.user.id];
            const lastMessage = unread
              ? t("newMessage")
              : c.online
                ? t("activeNow")
                : t("offline");
            return (
              <ChatDropdownItem
                key={c.user.id}
                chat={{
                  id: c.user.id,
                  name: c.user.name,
                  lastMessage,
                  time: "",
                  online: c.online,
                  unread,
                  gradient: pickGradient(c.user.id),
                }}
                onClick={() => handleItemClick(c)}
              />
            );
          })
        )}
      </Flex>
      <ChatDropdownFooter onSeeAll={goSeeAll} />
    </Flex>
  );
}
