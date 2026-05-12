"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { FriendRequest } from "../../data/mock";
import { FriendAvatar } from "./FriendAvatar";

const { Text } = Typography;

interface RequestCardProps {
  request: FriendRequest;
  online: boolean;
}

export function RequestCard({ request, online }: RequestCardProps) {
  const t = useTranslations("Profile.friendsTab");
  return (
    <Flex
      vertical
      gap={12}
      className="!w-full !p-3 sm:!p-4"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        boxShadow: "var(--shadow-md)",
      }}
    >
      <Flex gap={12} align="center" className="!min-w-0">
        <div className="!shrink-0 sm:!hidden">
          <FriendAvatar name={request.name} size={56} online={online} square />
        </div>
        <div className="!hidden !shrink-0 sm:!block">
          <FriendAvatar name={request.name} size={72} online={online} square />
        </div>
        <Flex vertical gap={2} className="!min-w-0 !flex-1">
          <Text
            className="!truncate !text-[15px] !font-bold !leading-tight sm:!text-[16px]"
            style={{ color: "var(--color-text)" }}
          >
            {request.name}
          </Text>
          <Text className="!truncate !text-[12px] sm:!text-[13px]" style={{ color: "var(--color-text-muted)" }}>
            {t("meta.mutual", { count: request.mutualFriends })}
          </Text>
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {request.time}
          </Text>
        </Flex>
      </Flex>
      <Flex gap={8} className="!w-full">
        <Button
          type="primary"
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px]"
        >
          <span className="!truncate">{t("actions.confirm")}</span>
        </Button>
        <Button
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px]"
          style={{
            background: "var(--color-bg-tertiary)",
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
          }}
        >
          <span className="!truncate">{t("actions.delete")}</span>
        </Button>
      </Flex>
    </Flex>
  );
}
