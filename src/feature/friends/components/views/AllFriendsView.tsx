"use client";

import { App, Flex, Input, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { FriendCard } from "../cards/FriendCard";
import { useFriendActions, useFriendsList } from "../../hooks/useFriends";

const { Title } = Typography;

export function AllFriendsView() {
  const t = useTranslations("Friends");
  const { message } = App.useApp();
  const nav = useNavigation();
  const [query, setQuery] = useState("");
  const friends = useFriendsList();
  const { busy, unfriend } = useFriendActions();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(q));
  }, [friends, query]);

  return (
    <Flex vertical gap={16} className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8">
      <Flex
        align="center"
        justify="space-between"
        gap={16}
        className="!w-full !flex-wrap"
      >
        <Title
          level={4}
          className="!m-0 !text-[20px] !font-bold text-[var(--color-text)]"  >
          {t("section.all")} · {friends.length}
        </Title>
        <Input
          allowClear
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          prefix={
            <Icon name="search" size={18} color="var(--color-text-secondary)" />
          }
          className="!h-10 !w-full !max-w-[320px] !rounded-full"
        />
      </Flex>
      <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
        {filtered.map((f) => (
          <FriendCard
            key={f.id}
            name={f.name}
            onOpen={() => nav.push(`/profile/${f.id}`)}
            meta={
              f.mutualFriends
                ? t("section.mutual", { count: f.mutualFriends })
                : undefined
            }
            secondaryMeta={f.location}
            primaryLabel={t("action.message")}
            secondaryLabel={t("action.unfriend")}
            secondaryDisabled={busy}
            onSecondary={async () => {
              await unfriend(f.id);
              message.info(t("section.removed"));
            }}
          />
        ))}
      </div>
    </Flex>
  );
}
