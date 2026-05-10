"use client";

import { Flex, Typography } from "antd";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { Avatar } from "../Avatar";

const { Title, Text } = Typography;

interface ProfileSectionProps {
  user: OnlineUserDto;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <Flex
      vertical
      align="center"
      gap={10}
      className="border-b border-[var(--color-border)] px-6 pb-6 pt-8"
    >
      <Avatar name={user.name} seed={user.id} size={88} online />
      <Title
        level={5}
        className="!m-0 !max-w-full !break-all !text-center !text-[16px] !font-semibold !text-[var(--color-text)]"
      >
        {user.name}
      </Title>
      <Text className="!text-[12px] !font-medium !text-[#22c55e]">
        Active now
      </Text>
    </Flex>
  );
}
