"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { FriendSuggestion } from "../../data/mock";
import { FriendAvatar } from "./FriendAvatar";

const { Text } = Typography;

interface SuggestionCardProps {
  suggestion: FriendSuggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
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
          <FriendAvatar name={suggestion.name} size={56} square />
        </div>
        <div className="!hidden !shrink-0 sm:!block">
          <FriendAvatar name={suggestion.name} size={72} square />
        </div>
        <Flex vertical gap={2} className="!min-w-0 !flex-1">
          <Text
            className="!truncate !text-[15px] !font-bold !leading-tight sm:!text-[16px]"
            style={{ color: "var(--color-text)" }}
          >
            {suggestion.name}
          </Text>
          <Text className="!truncate !text-[12px] sm:!text-[13px]" style={{ color: "var(--color-text-muted)" }}>
            {t("meta.mutual", { count: suggestion.mutualFriends })}
          </Text>
          {suggestion.reason ? (
            <Text className="!truncate !text-[12px]" style={{ color: "var(--color-text-muted)" }}>
              {suggestion.reason}
            </Text>
          ) : null}
        </Flex>
      </Flex>
      <Flex gap={8} className="!w-full">
        <Button
          type="primary"
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px]"
        >
          <Flex align="center" gap={6} className="!min-w-0">
            <Icon name="person_add" size={16} color="var(--color-on-primary, #fff)" />
            <span className="!truncate">{t("actions.addFriend")}</span>
          </Flex>
        </Button>
        <Button
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px]"
          style={{
            background: "var(--color-bg-tertiary)",
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
          }}
        >
          <span className="!truncate">{t("actions.remove")}</span>
        </Button>
      </Flex>
    </Flex>
  );
}
