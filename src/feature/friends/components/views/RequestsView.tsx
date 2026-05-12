"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FRIEND_REQUESTS } from "@/feature/profile/data/mock";
import { FriendCard } from "../cards/FriendCard";

const { Title, Text } = Typography;

type Status = "pending" | "accepted" | "deleted";

export function RequestsView() {
  const t = useTranslations("Friends");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const setStatus = (id: string, s: Status) =>
    setStatuses((prev) => ({ ...prev, [id]: s }));

  const pending = FRIEND_REQUESTS.filter(
    (r) => (statuses[r.id] ?? "pending") === "pending"
  );

  return (
    <Flex
      vertical
      gap={16}
      className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8"
    >
      <Flex align="baseline" justify="space-between" className="!w-full">
        <Title
          level={4}
          className="!m-0 !text-[20px] !font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {t("section.requests")}
        </Title>
        <Text
          className="!text-[15px]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {pending.length}
        </Text>
      </Flex>
      {FRIEND_REQUESTS.length === 0 && (
        <Text style={{ color: "var(--color-text-secondary)" }}>
          {t("section.noRequests")}
        </Text>
      )}
      <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
        {FRIEND_REQUESTS.map((r) => {
          const s = statuses[r.id] ?? "pending";
          const status =
            s === "accepted"
              ? t("section.requestAccepted")
              : s === "deleted"
                ? t("section.requestDeleted")
                : undefined;
          return (
            <FriendCard
              key={r.id}
              name={r.name}
              meta={t("section.mutual", { count: r.mutualFriends })}
              secondaryMeta={r.time}
              primaryLabel={t("action.confirm")}
              onPrimary={() => setStatus(r.id, "accepted")}
              secondaryLabel={t("action.delete")}
              onSecondary={() => setStatus(r.id, "deleted")}
              status={status}
            />
          );
        })}
      </div>
    </Flex>
  );
}
