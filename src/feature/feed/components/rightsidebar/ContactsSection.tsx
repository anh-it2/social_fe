"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Icon } from "@/shared/components/Icon";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import type { ContactRowData } from "../../data/types";
import { ContactRow } from "./ContactRow";

const { Text } = Typography;

export function ContactsSection() {
  const t = useTranslations("Feed.rightSidebar");
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const openChat = useChatBoxesStore((s) => s.openChat);
  const markRead = useChatRoomUnreadStore((s) => s.markRead);

  const contacts = useMemo<ContactRowData[]>(() => {
    const onlineIds = new Set(onlineUsers.map((u) => u.id));
    return knownUsers
      .map((u) => ({
        id: u.id,
        name: u.name,
        initial: (u.name?.[0] ?? "?").toUpperCase(),
        gradient: pickGradient(u.id),
        online: onlineIds.has(u.id),
      }))
      .sort((a, b) => Number(b.online) - Number(a.online));
  }, [onlineUsers, knownUsers]);

  function handleClick(c: ContactRowData) {
    markRead(c.id);
    openChat({
      id: c.id,
      name: c.name,
      lastMessage: "",
      time: "",
      online: !!c.online,
      gradient: c.gradient,
    });
  }

  return (
    <Flex vertical gap={4} className="!w-full">
      <Flex
        align="center"
        justify="space-between"
        className="!h-9 !w-full !pb-2"
      >
        <Text className="!text-base !font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          {t("contacts")}
        </Text>
        <Flex align="center" gap={8}>
          <Icon name="videocam" size={22} color="var(--color-text-secondary)" />
          <Icon name="search" size={22} color="var(--color-text-secondary)" />
          <Icon name="more_horiz" size={22} color="var(--color-text-secondary)" />
        </Flex>
      </Flex>
      {contacts.length === 0 ? (
        <Text
          className="!text-[13px] !px-1 !py-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("noContacts")}
        </Text>
      ) : (
        contacts.map((c) => (
          <ContactRow key={c.id} contact={c} onClick={() => handleClick(c)} />
        ))
      )}
    </Flex>
  );
}
