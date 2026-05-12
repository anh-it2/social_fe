"use client";

import { Button, Flex, Input, Typography } from "antd";
import type { InputRef } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  const contacts = useMemo<ContactRowData[]>(() => {
    const onlineIds = new Set(onlineUsers.map((u) => u.id));
    const base = knownUsers
      .map((u) => ({
        id: u.id,
        name: u.name,
        initial: (u.name?.[0] ?? "?").toUpperCase(),
        gradient: pickGradient(u.id),
        online: onlineIds.has(u.id),
      }))
      .sort((a, b) => Number(b.online) - Number(a.online));
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => c.name.toLowerCase().includes(q));
  }, [onlineUsers, knownUsers, query]);

  function closeSearch() {
    setSearching(false);
    setQuery("");
  }

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
        gap={8}
        className="!h-9 !w-full !pb-2"
      >
        {searching ? (
          <>
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") closeSearch();
              }}
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
              className="!h-8 !flex-1 !rounded-full !bg-[var(--color-bg-tertiary)] [&_input]:!bg-transparent [&_input]:!text-[13px] [&_input]:!text-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)]"
            />
            <Button
              type="text"
              shape="circle"
              size="small"
              onClick={closeSearch}
              aria-label={t("closeSearch")}
              icon={
                <Icon
                  name="close"
                  size={20}
                  color="var(--color-text-secondary)"
                />
              }
            />
          </>
        ) : (
          <>
            <Text
              className="!text-base !font-semibold"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("contacts")}
            </Text>
            <Flex align="center" gap={4}>
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label={t("videoCall")}
                icon={
                  <Icon
                    name="videocam"
                    size={22}
                    color="var(--color-text-secondary)"
                  />
                }
              />
              <Button
                type="text"
                shape="circle"
                size="small"
                onClick={() => setSearching(true)}
                aria-label={t("searchContacts")}
                icon={
                  <Icon
                    name="search"
                    size={22}
                    color="var(--color-text-secondary)"
                  />
                }
              />
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label={t("moreOptions")}
                icon={
                  <Icon
                    name="more_horiz"
                    size={22}
                    color="var(--color-text-secondary)"
                  />
                }
              />
            </Flex>
          </>
        )}
      </Flex>
      {contacts.length === 0 ? (
        <Text
          className="!text-[13px] !px-1 !py-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          {query.trim() ? t("noResults") : t("noContacts")}
        </Text>
      ) : (
        contacts.map((c) => (
          <ContactRow key={c.id} contact={c} onClick={() => handleClick(c)} />
        ))
      )}
    </Flex>
  );
}
