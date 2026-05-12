"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { Friend } from "../../data/mock";
import { FriendAvatar } from "./FriendAvatar";

const { Text } = Typography;

interface FriendCardProps {
  friend: Friend;
  online: boolean;
}

export function FriendCard({ friend, online }: FriendCardProps) {
  const t = useTranslations("Profile.friendsTab");
  return (
    <Flex
      vertical
      gap={12}
      className="!w-full !p-4"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        boxShadow: "var(--shadow-md)",
      }}
    >
      <Flex gap={12} align="center">
        <FriendAvatar name={friend.name} size={72} online={online} square />
        <Flex vertical gap={2} className="!min-w-0 !flex-1">
          <Text
            className="!truncate !text-[16px] !font-bold !leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            {friend.name}
          </Text>
          {typeof friend.mutualFriends === "number" ? (
            <Text className="!text-[13px]" style={{ color: "var(--color-text-muted)" }}>
              {t("meta.mutual", { count: friend.mutualFriends })}
            </Text>
          ) : null}
          {friend.location ? (
            <Flex align="center" gap={4}>
              <Icon name="location_on" size={14} color="var(--color-text-muted)" />
              <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                {friend.location}
              </Text>
            </Flex>
          ) : null}
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
          className="!h-9 !flex-1 !rounded-[10px] !text-[13px] !font-semibold"
          style={{
            background: "var(--color-bg-tertiary)",
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
          }}
        >
          <Flex align="center" gap={6}>
            <Icon name="more_horiz" size={16} color="var(--color-text-secondary)" />
            {t("actions.more")}
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
}
