"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { Friend } from "../../../data/mock";
import { FriendAvatar } from "../shared/FriendAvatar";

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
      className="!w-full !p-3 sm:!p-4 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[16px] [box-shadow:var(--shadow-md)]"  >
      <Flex gap={12} align="center" className="!min-w-0">
        <div className="!shrink-0 sm:!hidden">
          <FriendAvatar name={friend.name} size={56} online={online} square />
        </div>
        <div className="!hidden !shrink-0 sm:!block">
          <FriendAvatar name={friend.name} size={72} online={online} square />
        </div>
        <Flex vertical gap={2} className="!min-w-0 !flex-1">
          <Text
            className="!truncate !text-[15px] !font-bold !leading-tight sm:!text-[16px] text-[var(--color-text)]"  >
            {friend.name}
          </Text>
          {typeof friend.mutualFriends === "number" ? (
            <Text className="!truncate !text-[12px] sm:!text-[13px] text-[var(--color-text-muted)]" >
              {t("meta.mutual", { count: friend.mutualFriends })}
            </Text>
          ) : null}
          {friend.location ? (
            <Flex align="center" gap={4} className="!min-w-0">
              <Icon name="location_on" size={14} color="var(--color-text-muted)" />
              <Text className="!truncate !text-[12px] text-[var(--color-text-muted)]" >
                {friend.location}
              </Text>
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      <Flex gap={8} className="!w-full">
        <Button
          type="primary"
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px]"
        >
          <Flex align="center" gap={6} className="!min-w-0">
            <Icon name="chat_bubble" size={16} color="var(--color-on-primary, #fff)" />
            <span className="!truncate">{t("actions.message")}</span>
          </Flex>
        </Button>
        <Button
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px] bg-[var(--color-bg-tertiary)] text-[var(--color-text)] [border-color:var(--color-border)]"  >
          <Flex align="center" gap={6} className="!min-w-0">
            <Icon name="more_horiz" size={16} color="var(--color-text-secondary)" />
            <span className="!truncate">{t("actions.more")}</span>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
}
