"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { pickGradient } from "@/feature/chat/lib/avatar";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ConversationItemProps {
  user: OnlineUserDto;
  active: boolean;
  online?: boolean;
  unread?: boolean;
  onClick: () => void;
}

export function ConversationItem({
  user,
  active,
  online = true,
  unread = false,
  onClick,
}: ConversationItemProps) {
  const t = useTranslations("Chat.sidebar");
  const lastMessage = unread
    ? t("newMessage")
    : online
      ? t("activeNow")
      : t("offline");

  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className="chat-dd-item !w-full"
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        cursor: "pointer",
        background: active ? "var(--color-primary-bg)" : "transparent",
      }}
    >
      <div className="relative shrink-0">
        <Flex
          align="center"
          justify="center"
          className="!rounded-full"
          style={{
            width: 52,
            height: 52,
            background: gradientBg([...pickGradient(user.id)]),
          }}
        >
          <Icon name="person" size={28} color="#FFFFFF" />
        </Flex>
        {online ? (
          <span
            className="absolute"
            style={{
              right: 0,
              bottom: 0,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid var(--color-bg-secondary)",
            }}
          />
        ) : null}
      </div>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          ellipsis
          className="!text-sm"
          style={{
            color: "var(--color-text)",
            fontWeight: unread ? 700 : active ? 600 : 500,
          }}
        >
          {user.name}
        </Text>
        <Text
          ellipsis
          className="!text-[13px]"
          style={{
            color: unread ? "var(--color-text)" : "var(--color-text-muted)",
            fontWeight: unread ? 600 : 400,
          }}
        >
          {lastMessage}
        </Text>
      </Flex>
      {unread ? (
        <span
          aria-label={t("unreadLabel")}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#4096ff",
            flexShrink: 0,
          }}
        />
      ) : null}
    </Flex>
  );
}
