"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { FriendAvatar } from "@/feature/profile/components/friends-tab/FriendAvatar";
import type { FriendSuggestion } from "@/feature/profile/data/mock";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface SuggestionTileProps {
  suggestion: FriendSuggestion;
  onAdd: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function SuggestionTile({ suggestion, onAdd, onDismiss }: SuggestionTileProps) {
  const t = useTranslations("Feed.peopleYouMayKnow");

  return (
    <Flex
      vertical
      className="!shrink-0 !overflow-hidden"
      style={{
        width: 168,
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
      }}
    >
      <div className="!relative" style={{ width: "100%", height: 200 }}>
        <FriendAvatar name={suggestion.name} size={168} square />
        <Button
          type="text"
          shape="circle"
          aria-label={t("dismiss")}
          onClick={() => onDismiss(suggestion.id)}
          icon={<Icon name="close" size={16} color="#fff" />}
          className="!absolute !top-1.5 !right-1.5 !h-7 !w-7"
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "none",
          }}
        />
      </div>
      <Flex vertical gap={2} className="!px-3 !pt-2">
        <Text
          className="!truncate !text-[14px] !font-semibold !leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {suggestion.name}
        </Text>
        <Flex align="center" gap={4} className="!min-w-0">
          <Icon
            name="group"
            size={12}
            color="var(--color-text-muted)"
          />
          <Text
            className="!truncate !text-[12px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("mutual", { count: suggestion.mutualFriends })}
          </Text>
        </Flex>
      </Flex>
      <div className="!px-3 !pt-2 !pb-3">
        <Button
          type="primary"
          block
          onClick={() => onAdd(suggestion.id)}
          className="!h-8 !rounded-[8px] !text-[13px] !font-semibold"
        >
          {t("addFriend")}
        </Button>
      </div>
    </Flex>
  );
}
