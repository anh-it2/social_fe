"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import type { ChatPreview } from "@/shared/data/chats";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ChatDropdownItemProps {
  chat: ChatPreview;
  onClick: () => void;
}

export function ChatDropdownItem({ chat, onClick }: ChatDropdownItemProps) {
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
            background: gradientBg([...chat.gradient]),
          }}
        >
          <Icon name="person" size={28} color="#FFFFFF" />
        </Flex>
        {chat.online ? (
          <span
            className="absolute"
            style={{
              right: 0,
              bottom: 0,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid #1a1a1a",
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
            fontWeight: chat.unread ? 700 : 500,
          }}
        >
          {chat.name}
        </Text>
        <Flex align="center" gap={6}>
          <Text
            ellipsis
            className="!text-[13px] !flex-1"
            style={{
              color: chat.unread ? "var(--color-text)" : "var(--color-text-muted)",
              fontWeight: chat.unread ? 600 : 400,
            }}
          >
            {chat.lastMessage}
          </Text>
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            · {chat.time}
          </Text>
        </Flex>
      </Flex>
      {chat.unread ? (
        <span
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
