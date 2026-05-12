"use client";

import { Button, Flex, Tooltip, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { ChatPreview } from "@/shared/data/chats";
import { FriendAvatar } from "./FriendAvatar";
import styles from "./OnlineFriendCard.module.scss";

const { Text } = Typography;

interface OnlineFriendCardProps {
  chat: ChatPreview;
}

export function OnlineFriendCard({ chat }: OnlineFriendCardProps) {
  const t = useTranslations("Profile.friendsTab");
  const [c1, c2] = chat.gradient;

  return (
    <div
      className={`${styles.card} !relative !w-full !overflow-hidden`}
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 18,
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        className="!h-2 !w-full"
        style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
      />
      <Flex vertical gap={12} className="!p-4">
        <Flex gap={12} align="flex-start">
          <FriendAvatar
            name={chat.name}
            size={64}
            online
            gradient={chat.gradient}
            square
          />
          <Flex vertical gap={4} className="!min-w-0 !flex-1">
            <Flex align="center" gap={8} className="!min-w-0">
              <Text
                className="!truncate !text-[16px] !font-bold !leading-tight"
                style={{ color: "var(--color-text)" }}
              >
                {chat.name}
              </Text>
              <span
                className="!inline-flex !shrink-0 !items-center !gap-1 !rounded-full !px-2 !py-0.5 !text-[11px] !font-semibold"
                style={{
                  background: "color-mix(in srgb, var(--color-success) 18%, transparent)",
                  color: "var(--color-success)",
                }}
              >
                <span
                  className="!inline-block !rounded-full"
                  style={{ width: 6, height: 6, background: "var(--color-success)" }}
                />
                {t("meta.activeNow")}
              </span>
            </Flex>
            <Text
              className="!line-clamp-2 !text-[13px] !leading-snug"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {chat.lastMessage}
            </Text>
            <Flex align="center" gap={6}>
              <Icon name="schedule" size={12} color="var(--color-text-muted)" />
              <Text className="!text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                {chat.time}
              </Text>
              {chat.unread ? (
                <span
                  className="!ml-1 !inline-block !rounded-full"
                  style={{ width: 6, height: 6, background: "var(--color-primary)" }}
                />
              ) : null}
            </Flex>
          </Flex>
        </Flex>
        <Flex gap={8} className="!w-full">
          <Button
            type="primary"
            className="!h-9 !flex-1 !rounded-[10px] !text-[13px] !font-semibold"
          >
            <Flex align="center" gap={6}>
              <Icon name="chat_bubble" size={16} color="var(--color-on-primary, #fff)" />
              {t("actions.message")}
            </Flex>
          </Button>
          <Button
            className={`${styles.waveBtn} !h-9 !flex-1 !rounded-[10px] !text-[13px] !font-semibold`}
            style={{
              background: "var(--color-bg-tertiary)",
              color: "var(--color-text)",
              borderColor: "var(--color-border)",
            }}
          >
            <Flex align="center" gap={6}>
              <Icon name="waving_hand" size={16} color="var(--color-warning, #f59e0b)" />
              {t("actions.wave")}
            </Flex>
          </Button>
          <Tooltip title={t("actions.more")}>
            <Button
              className="!h-9 !w-9 !rounded-[10px] !p-0"
              style={{
                background: "var(--color-bg-tertiary)",
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
              }}
            >
              <Icon name="more_horiz" size={16} color="var(--color-text-secondary)" />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </div>
  );
}
