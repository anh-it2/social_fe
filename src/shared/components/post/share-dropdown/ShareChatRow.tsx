"use client";

import { Button, Checkbox, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Avatar } from "@/feature/chat/components/Avatar";
import { Icon } from "@/shared/components/Icon";
import type { ChatPreview } from "@/shared/data/chats";
import styles from "./ShareChatRow.module.scss";

const { Text } = Typography;

interface ShareChatRowProps {
  chat: ChatPreview;
  selected: boolean;
  sent: boolean;
  onToggle: () => void;
  onSendNow: () => void;
}

export function ShareChatRow({
  chat,
  selected,
  sent,
  onToggle,
  onSendNow,
}: ShareChatRowProps) {
  const t = useTranslations("Post.shareDropdown.sendModal");

  return (
    <Flex
      align="center"
      gap={12}
      role="button"
      tabIndex={sent ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={sent}
      onClick={() => {
        if (!sent) onToggle();
      }}
      onKeyDown={(e) => {
        if (sent) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`${styles.row} !w-full !rounded-xl !px-3 !py-2`}
      style={{
        background: selected ? "var(--color-primary-bg)" : "transparent",
        cursor: sent ? "default" : "pointer",
        opacity: sent ? 0.6 : 1,
      }}
    >
      <Checkbox
        checked={selected || sent}
        disabled={sent}
        onClick={(e) => e.stopPropagation()}
        onChange={() => {
          if (!sent) onToggle();
        }}
      />
      <Avatar name={chat.name} size={44} online={chat.online} />
      <Flex vertical className="!min-w-0 !flex-1">
        <Text
          className="!truncate !text-[15px] !font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {chat.name}
        </Text>
        <Text
          className="!truncate !text-[12px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {chat.lastMessage}
        </Text>
      </Flex>
      {sent ? (
        <Flex align="center" gap={4} className="!shrink-0">
          <Icon name="check_circle" size={18} color="var(--color-success)" />
          <Text
            className="!text-[13px] !font-semibold"
            style={{ color: "var(--color-success)" }}
          >
            {t("sent")}
          </Text>
        </Flex>
      ) : (
        <Button
          type="primary"
          size="small"
          className="!h-8 !shrink-0 !rounded-full !px-4 !text-[13px] !font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onSendNow();
          }}
        >
          {t("send")}
        </Button>
      )}
    </Flex>
  );
}
