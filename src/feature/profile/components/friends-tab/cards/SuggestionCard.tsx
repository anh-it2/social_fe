"use client";

import { App, Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { useNavigation } from "@/shared/hooks/useNavigation";
import {
  useFriendActions,
  useFriendStatus,
} from "@/feature/friends/hooks/useFriends";
import type { FriendSuggestion } from "../../../data/mock";
import { FriendAvatar } from "../shared/FriendAvatar";

const { Text } = Typography;

interface SuggestionCardProps {
  suggestion: FriendSuggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const t = useTranslations("Profile.friendsTab");
  const tf = useTranslations("Friends");
  const { message } = App.useApp();
  const nav = useNavigation();
  const status = useFriendStatus(suggestion.id);
  const { busy, sendRequest, cancelRequest } = useFriendActions();
  const requested = status === "requested";
  const openProfile = () => nav.push(`/profile/${suggestion.id}`);
  return (
    <Flex
      vertical
      gap={12}
      className="!w-full !p-3 sm:!p-4 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[16px] [box-shadow:var(--shadow-md)]"  >
      <Flex
        gap={12}
        align="center"
        onClick={openProfile}
        className="!min-w-0 !cursor-pointer"
      >
        <div className="!shrink-0 sm:!hidden">
          <FriendAvatar name={suggestion.name} size={56} square />
        </div>
        <div className="!hidden !shrink-0 sm:!block">
          <FriendAvatar name={suggestion.name} size={72} square />
        </div>
        <Flex vertical gap={2} className="!min-w-0 !flex-1">
          <Text
            className="!truncate !text-[15px] !font-bold !leading-tight hover:!underline sm:!text-[16px] text-[var(--color-text)]"  >
            {suggestion.name}
          </Text>
          <Text className="!truncate !text-[12px] sm:!text-[13px] text-[var(--color-text-muted)]" >
            {t("meta.mutual", { count: suggestion.mutualFriends })}
          </Text>
          {suggestion.reason ? (
            <Text className="!truncate !text-[12px] text-[var(--color-text-muted)]" >
              {suggestion.reason}
            </Text>
          ) : null}
        </Flex>
      </Flex>
      <Flex gap={8} className="!w-full">
        <Button
          type="primary"
          disabled={busy || requested}
          onClick={async () => {
            await sendRequest(suggestion.id);
            message.success(tf("section.added"));
          }}
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px]"
        >
          <Flex align="center" gap={6} className="!min-w-0">
            <Icon
              name={requested ? "schedule" : "person_add"}
              size={16}
              color="var(--color-on-primary, #fff)"
            />
            <span className="!truncate">
              {requested ? tf("action.requested") : t("actions.addFriend")}
            </span>
          </Flex>
        </Button>
        <Button
          disabled={busy}
          onClick={async () => {
            if (!requested) return;
            await cancelRequest(suggestion.id);
            message.info(tf("section.requestDeleted"));
          }}
          className="!h-9 !min-w-0 !flex-1 !rounded-[10px] !text-[12px] !font-semibold sm:!text-[13px] bg-[var(--color-bg-tertiary)] text-[var(--color-text)] [border-color:var(--color-border)]"  >
          <span className="!truncate">
            {requested ? tf("action.cancel") : t("actions.remove")}
          </span>
        </Button>
      </Flex>
    </Flex>
  );
}
