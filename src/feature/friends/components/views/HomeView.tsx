"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  FRIEND_REQUESTS,
  FRIEND_SUGGESTIONS,
} from "@/feature/profile/data/mock";
import { FriendCard } from "../cards/FriendCard";

const { Title } = Typography;

interface HomeViewProps {
  onSeeAllRequests: () => void;
  onSeeAllSuggestions: () => void;
}

type ReqStatus = "pending" | "accepted" | "deleted";
type SugStatus = "active" | "added" | "removed";

export function HomeView({
  onSeeAllRequests,
  onSeeAllSuggestions,
}: HomeViewProps) {
  const t = useTranslations("Friends");
  const [reqStatuses, setReqStatuses] = useState<Record<string, ReqStatus>>({});
  const [sugStatuses, setSugStatuses] = useState<Record<string, SugStatus>>({});

  return (
    <Flex
      vertical
      gap={32}
      className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8"
    >
      <Flex vertical gap={16} className="!w-full">
        <Flex align="baseline" justify="space-between" className="!w-full">
          <Title
            level={4}
            className="!m-0 !text-[20px] !font-bold"
            style={{ color: "var(--color-text)" }}
          >
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
          {FRIEND_REQUESTS.slice(0, 5).map((r) => {
            const s = reqStatuses[r.id] ?? "pending";
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
                onPrimary={() =>
                  setReqStatuses((p) => ({ ...p, [r.id]: "accepted" }))
                }
                secondaryLabel={t("action.delete")}
                onSecondary={() =>
                  setReqStatuses((p) => ({ ...p, [r.id]: "deleted" }))
                }
                status={status}
              />
            );
          })}
        </div>
      </Flex>

      <Flex vertical gap={16} className="!w-full">
        <Flex align="baseline" justify="space-between" className="!w-full">
          <Title
            level={4}
            className="!m-0 !text-[20px] !font-bold"
            style={{ color: "var(--color-text)" }}
          >
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
          {FRIEND_SUGGESTIONS.slice(0, 5).map((s) => {
            const st = sugStatuses[s.id] ?? "active";
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
                onPrimary={() =>
                  setSugStatuses((p) => ({ ...p, [s.id]: "added" }))
                }
                secondaryLabel={t("action.remove")}
                onSecondary={() =>
                  setSugStatuses((p) => ({ ...p, [s.id]: "removed" }))
                }
                status={status}
              />
            );
          })}
        </div>
      </Flex>
    </Flex>
  );
}
