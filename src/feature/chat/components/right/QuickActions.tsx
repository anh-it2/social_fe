"use client";

import {
  BellFilled,
  BellOutlined,
  PhoneOutlined,
  SearchOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { App, Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useConversationSettings } from "../../hooks/useConversationSettings";
import { useChatSearchStore } from "../../stores/chat-search.store";

const { Text } = Typography;

type ActionKey = "audio" | "video" | "mute" | "search";

interface QuickActionsProps {
  conversationId: string;
}

export function QuickActions({ conversationId }: QuickActionsProps) {
  const t = useTranslations("Chat.right");
  const { message } = App.useApp();
  const { settings, setMuted } = useConversationSettings(conversationId);
  const muted = !!settings.muted;
  const searchOpenFor = useChatSearchStore((s) => s.openFor);
  const toggleSearch = useChatSearchStore((s) => s.toggle);
  const searchActive = searchOpenFor === conversationId;

  async function handleMute() {
    const next = !muted;
    await setMuted(next);
    message.success(next ? t("muteOn") : t("muteOff"));
  }

  const actions: {
    key: ActionKey;
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    active?: boolean;
  }[] = [
    { key: "audio", icon: <PhoneOutlined />, label: t("audio") },
    { key: "video", icon: <VideoCameraOutlined />, label: t("video") },
    {
      key: "mute",
      icon: muted ? <BellFilled /> : <BellOutlined />,
      label: muted ? t("unmute") : t("mute"),
      onClick: handleMute,
      active: muted,
    },
    {
      key: "search",
      icon: <SearchOutlined />,
      label: t("search"),
      onClick: () => toggleSearch(conversationId),
      active: searchActive,
    },
  ];

  return (
    <Flex
      justify="space-around"
      gap={8}
      className="border-b border-[var(--color-border)] px-6 py-6"
    >
      {actions.map((a) => (
        <Flex key={a.key} vertical align="center" gap={6}>
          <Button
            type="text"
            shape="circle"
            icon={a.icon}
            onClick={a.onClick}
            className={`!h-11 !w-11 hover:!bg-[#e4e6eb] dark:hover:!bg-[#262626] ${
              a.active
                ? "!bg-[var(--color-primary)]/15 !text-[var(--color-primary)]"
                : "!bg-[#f0f2f5] !text-[var(--color-primary)] dark:!bg-[#1f1f1f]"
            }`}
          />
          <Text className="!text-[11px] !font-medium !text-[var(--color-text)]">
            {a.label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
