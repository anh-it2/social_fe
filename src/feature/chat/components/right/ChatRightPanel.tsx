"use client";

import { Flex, Typography } from "antd";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { PrivacyActions } from "./PrivacyActions";
import { ProfileSection } from "./ProfileSection";
import { QuickActions } from "./QuickActions";

const { Text } = Typography;

interface ChatRightPanelProps {
  user: OnlineUserDto | null;
}

export function ChatRightPanel({ user }: ChatRightPanelProps) {
  if (!user) {
    return (
      <aside className="flex h-full w-[340px] shrink-0 items-center justify-center border-l border-[var(--color-border)] bg-white px-6 dark:bg-[#141414]">
        <Text className="!text-center !text-[13px] !text-[var(--color-text-muted)]">
          Pick a conversation to see profile details.
        </Text>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-[var(--color-border)] bg-white pr-3 dark:bg-[#141414]">
      <ProfileSection user={user} />
      <div className="h-3" />
      <QuickActions />
      <div className="h-3" />
      <Flex
        vertical
        gap={12}
        className="border-b border-[var(--color-border)] px-6 py-6"
      >
        <Flex justify="space-between" align="center" gap={8}>
          <Text className="!text-[14px] !font-semibold !text-[var(--color-text)]">
            Shared media
          </Text>
          <Text className="!shrink-0 !cursor-pointer !text-[12px] !font-semibold !text-[var(--color-primary)]">
            See all
          </Text>
        </Flex>
        <Text className="!text-[13px] !text-[var(--color-text-muted)]">
          No shared media yet
        </Text>
      </Flex>
      <div className="h-3" />
      <PrivacyActions recipientName={user.name} />
    </aside>
  );
}
