"use client";

import { App, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { FriendCard } from "../cards/FriendCard";
import { useFriendActions, useIncomingRequests } from "../../hooks/useFriends";

const { Title, Text } = Typography;

export function RequestsView() {
  const t = useTranslations("Friends");
  const { message } = App.useApp();
  const nav = useNavigation();
  const incoming = useIncomingRequests();
  const { busy, acceptRequest, rejectRequest } = useFriendActions();

  return (
    <Flex vertical gap={16} className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8">
      <Flex align="baseline" justify="space-between" className="!w-full">
        <Title
          level={4}
          className="!m-0 !text-[20px] !font-bold text-[var(--color-text)]"  >
          {t("section.requests")}
        </Title>
        <Text
          className="!text-[15px] text-[var(--color-text-secondary)]"  >
          {incoming.length}
        </Text>
      </Flex>
      {incoming.length === 0 ? (
        <Text className="text-[var(--color-text-secondary)]" >
          {t("section.noRequests")}
        </Text>
      ) : (
        <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
          {incoming.map((r) => (
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
      )}
    </Flex>
  );
}
