"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FRIEND_SUGGESTIONS } from "@/feature/profile/data/mock";
import { FriendCard } from "../cards/FriendCard";

const { Title } = Typography;

type Status = "active" | "added" | "removed";

export function SuggestionsView() {
  const t = useTranslations("Friends");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const setStatus = (id: string, s: Status) =>
    setStatuses((prev) => ({ ...prev, [id]: s }));

  return (
    <Flex
      vertical
      gap={16}
      className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8"
    >
      <Title
        level={4}
        className="!m-0 !text-[20px] !font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {t("section.suggestions")}
      </Title>
      <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
        {FRIEND_SUGGESTIONS.map((s) => {
          const st = statuses[s.id] ?? "active";
          const status =
            st === "added"
              ? t("section.added")
              : st === "removed"
                ? t("section.removed")
                : undefined;
          return (
            <FriendCard
              key={s.id}
              name={s.name}
              meta={t("section.mutual", { count: s.mutualFriends })}
              secondaryMeta={s.reason}
              primaryLabel={t("action.addFriend")}
              onPrimary={() => setStatus(s.id, "added")}
              secondaryLabel={t("action.remove")}
              onSecondary={() => setStatus(s.id, "removed")}
              status={status}
            />
          );
        })}
      </div>
    </Flex>
  );
}
