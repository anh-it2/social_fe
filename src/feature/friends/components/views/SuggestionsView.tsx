"use client";

import { App, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { FriendCard } from "../cards/FriendCard";
import {
  useFriendActions,
  useSuggestions,
} from "../../hooks/useFriends";
import { useFriendsStore } from "../../stores/friends.store";

const { Title } = Typography;

export function SuggestionsView() {
  const t = useTranslations("Friends");
  const { message } = App.useApp();
  const nav = useNavigation();
  const suggestions = useSuggestions();
  const statusMap = useFriendsStore((s) => s.status);
  const { busy, sendRequest, cancelRequest } = useFriendActions();

  return (
    <Flex vertical gap={16} className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8">
      <Title
        level={4}
        className="!m-0 !text-[20px] !font-bold text-[var(--color-text)]"  >
        {t("section.suggestions")}
      </Title>
      <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
        {suggestions.map((s) => {
          const requested = (statusMap[s.id] ?? "none") === "requested";
          return (
            <FriendCard
              key={s.id}
              name={s.name}
              onOpen={() => nav.push(`/profile/${s.id}`)}
              meta={t("section.mutual", { count: s.mutualFriends })}
              secondaryMeta={s.reason}
              primaryLabel={
                requested ? t("action.requested") : t("action.addFriend")
              }
              primaryDisabled={busy || requested}
              onPrimary={async () => {
                await sendRequest(s.id);
                message.success(t("section.added"));
              }}
              secondaryLabel={
                requested ? t("action.cancel") : t("action.remove")
              }
              secondaryDisabled={busy}
              onSecondary={async () => {
                await cancelRequest(s.id);
                if (requested) message.info(t("section.requestDeleted"));
              }}
            />
          );
        })}
      </div>
    </Flex>
  );
}
