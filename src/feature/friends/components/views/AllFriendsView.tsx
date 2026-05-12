"use client";

import { Flex, Input, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FRIENDS } from "@/feature/profile/data/mock";
import { Icon } from "@/shared/components/Icon";
import { FriendCard } from "../cards/FriendCard";

const { Title } = Typography;

export function AllFriendsView() {
  const t = useTranslations("Friends");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FRIENDS;
    return FRIENDS.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <Flex
      vertical
      gap={16}
      className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8"
    >
      <Flex align="center" justify="space-between" gap={16} className="!w-full !flex-wrap">
        <Title
          level={4}
          className="!m-0 !text-[20px] !font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {t("section.all")} · {FRIENDS.length}
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
            meta={
              f.mutualFriends
                ? t("section.mutual", { count: f.mutualFriends })
                : undefined
            }
            secondaryMeta={f.location}
            primaryLabel={t("action.message")}
            secondaryLabel={t("action.friends")}
          />
        ))}
      </div>
    </Flex>
  );
}
