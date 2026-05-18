"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { FriendAvatar } from "@/feature/profile/components/friends-tab/shared/FriendAvatar";
import type { FriendSuggestion } from "@/feature/profile/data/mock";
import { Icon } from "@/shared/components/Icon";
import { useNavigation } from "@/shared/hooks/useNavigation";

const { Text } = Typography;

interface SuggestionTileProps {
  suggestion: FriendSuggestion;
  onAdd: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function SuggestionTile({ suggestion, onAdd, onDismiss }: SuggestionTileProps) {
  const t = useTranslations("Feed.peopleYouMayKnow");
  const nav = useNavigation();
  const openProfile = () => nav.push(`/profile/${suggestion.id}`);

  return (
    <Flex
      vertical
      className="!shrink-0 !overflow-hidden w-[168px] bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[12px]"  >
      <div className="!relative w-[100%] h-[200px]" >
        <div
          onClick={openProfile}
          className="!h-full !w-full !cursor-pointer"
          role="link"
          aria-label={suggestion.name}
        >
          <FriendAvatar name={suggestion.name} size={168} square />
        </div>
        <Button
          type="text"
          shape="circle"
          aria-label={t("dismiss")}
          onClick={() => onDismiss(suggestion.id)}
          icon={<Icon className="bg-[rgba(0,0,0,0.55)] [border:none]" name="close" size={16} color="#fff" />}
          className="!absolute !top-1.5 !right-1.5 !h-7 !w-7"  />
      </div>
      <Flex vertical gap={2} className="!px-3 !pt-2">
        <Text
          onClick={openProfile}
          className="!truncate !text-[14px] !font-semibold !leading-tight !cursor-pointer hover:!underline text-[var(--color-text)]"  >
          {suggestion.name}
        </Text>
        <Flex align="center" gap={4} className="!min-w-0">
          <Icon
            name="group"
            size={12}
            color="var(--color-text-muted)"
          />
          <Text
            className="!truncate !text-[12px] text-[var(--color-text-muted)]"  >
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
