"use client";

import { App, Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { FriendCard } from "../cards/FriendCard";
import {
  useFriendActions,
  useIncomingRequests,
  useSuggestions,
} from "../../hooks/useFriends";
import { useFriendsStore } from "../../stores/friends.store";

const { Title } = Typography;

interface HomeViewProps {
  onSeeAllRequests: () => void;
  onSeeAllSuggestions: () => void;
}

export function HomeView({
  onSeeAllRequests,
  onSeeAllSuggestions,
}: HomeViewProps) {
  const t = useTranslations("Friends");
  const { message } = App.useApp();
  const nav = useNavigation();
  const incoming = useIncomingRequests();
  const suggestions = useSuggestions();
  const statusMap = useFriendsStore((s) => s.status);
  const {
    busy,
    acceptRequest,
    rejectRequest,
    sendRequest,
    cancelRequest,
  } = useFriendActions();

  return (
    <Flex vertical gap={32} className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8">
      <Flex vertical gap={16} className="!w-full">
        <Flex align="baseline" justify="space-between" className="!w-full">
          <Title
            level={4}
            className="!m-0 !text-[20px] !font-bold text-[var(--color-text)]"  >
            {t("section.requests")}
          </Title>
          <Button
            type="link"
            onClick={onSeeAllRequests}
            className="!p-0 !text-[15px] !font-semibold"
          >
            {t("section.seeAll")}
          </Button>
        </Flex>
        <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
          {incoming.slice(0, 5).map((r) => (
            <FriendCard
              key={r.id}
              name={r.name}
              onOpen={() => nav.push(`/profile/${r.id}`)}
              meta={t("section.mutual", { count: r.mutualFriends })}
              secondaryMeta={r.requestedAt}
              primaryLabel={t("action.confirm")}
              primaryDisabled={busy}
              onPrimary={async () => {
                await acceptRequest(r.id);
                message.success(t("section.requestAccepted"));
              }}
              secondaryLabel={t("action.delete")}
              secondaryDisabled={busy}
              onSecondary={async () => {
                await rejectRequest(r.id);
                message.info(t("section.requestDeleted"));
              }}
            />
          ))}
        </div>
      </Flex>

      <Flex vertical gap={16} className="!w-full">
        <Flex align="baseline" justify="space-between" className="!w-full">
          <Title
            level={4}
            className="!m-0 !text-[20px] !font-bold text-[var(--color-text)]"  >
            {t("section.suggestions")}
          </Title>
          <Button
            type="link"
            onClick={onSeeAllSuggestions}
            className="!p-0 !text-[15px] !font-semibold"
          >
            {t("section.seeAll")}
          </Button>
        </Flex>
        <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
          {suggestions.slice(0, 5).map((s) => {
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
    </Flex>
  );
}
