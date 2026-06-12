"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { Avatar } from "../../Avatar";

const { Title, Text } = Typography;

interface ProfileSectionProps {
  user: OnlineUserDto;
  displayName?: string;
  isOnline?: boolean;
}

export function ProfileSection({
  user,
  displayName,
  isOnline = false,
}: ProfileSectionProps) {
  const t = useTranslations("Chat.header");
  const name = displayName ?? user.name;
  return (
    <Flex
      vertical
      align="center"
      gap={10}
      className="border-b border-[var(--color-border)] px-6 pb-6 pt-8"
    >
      <Avatar
        name={name}
        src={user.avatar}
        seed={user.id}
        size={88}
        online={isOnline}
      />
      <Title
        level={5}
        className="!m-0 !max-w-full !break-all !text-center !text-[16px] !font-semibold !text-[var(--color-text)]"
      >
        {name}
      </Title>
      <Text
        className="!text-[12px] !font-medium"
        style={{
          color: isOnline ? "#22c55e" : "var(--color-text-muted)",
        }}
      >
        {isOnline ? t("activeNow") : t("offline")}
      </Text>
    </Flex>
  );
}
