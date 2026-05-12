"use client";

import { App, Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { REEL_RECOMMENDS } from "@/feature/feed/data/constants";
import type { ReelData } from "@/feature/feed/data/types";
import { useUserReels } from "@/feature/feed/data/useUserReels";
import { ReelComposerModal } from "@/feature/feed/components/center/reels/ReelComposerModal";
import {
  ReelComposerProvider,
  useReelComposer,
} from "@/feature/feed/lib/reelComposer";
import { Icon } from "@/shared/components/Icon";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { ReelFullCard } from "./ReelFullCard";

const { Title } = Typography;

function ReelsPageInner() {
  const t = useTranslations("Feed.reelsPage");
  const nav = useNavigation();
  const reelComposer = useReelComposer();
  const { reels: userReels, addReel } = useUserReels();
  const { message } = App.useApp();
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    const userItems = userReels.map((r) => ({ kind: "user" as const, reel: r }));
    const recItems = REEL_RECOMMENDS.map((r) => ({
      kind: "recommend" as const,
      reel: r,
    }));
    return [...userItems, ...recItems];
  }, [userReels]);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (reel: ReelData) => {
    addReel(reel);
    message.success(t("upload"));
  };

  return (
    <div
      className="!relative !w-full"
      style={{ background: "#000", height: "100dvh" }}
    >
      <Flex
        align="center"
        justify="space-between"
        className="!absolute !top-0 !left-0 !right-0 !z-30 !px-3 !py-2 sm:!px-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Flex align="center" gap={8}>
          <Button
            type="text"
            shape="circle"
            aria-label={t("back")}
            onClick={() => nav.push("/")}
            icon={<Icon name="arrow_back" size={20} color="#fff" />}
            className="!h-9 !w-9"
            style={{ background: "rgba(0,0,0,0.35)" }}
          />
          <Title
            level={4}
            className="!m-0 !text-[18px] !font-bold !text-white"
          >
            {t("title")}
          </Title>
        </Flex>
        <Button
          type="primary"
          onClick={() => reelComposer?.openComposer(undefined)}
          icon={<Icon name="add" size={18} color="var(--color-on-primary)" />}
          className="!h-9 !rounded-[10px] !font-semibold"
        >
          {t("upload")}
        </Button>
      </Flex>

      <div
        className="!h-full !w-full !overflow-y-auto !snap-y !snap-mandatory no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.length === 0 ? (
          <Flex
            align="center"
            justify="center"
            className="!h-full !w-full"
          >
            <Typography.Text
              className="!text-[14px]"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {t("empty")}
            </Typography.Text>
          </Flex>
        ) : (
          items.map((it) =>
            it.kind === "user" ? (
              <ReelFullCard
                key={`u-${it.reel.id}`}
                kind="user"
                reel={it.reel}
                liked={liked.has(it.reel.id)}
                onLikeToggle={() => toggleLike(it.reel.id)}
              />
            ) : (
              <ReelFullCard
                key={`r-${it.reel.id}`}
                kind="recommend"
                reel={it.reel}
                liked={liked.has(it.reel.id)}
                onLikeToggle={() => toggleLike(it.reel.id)}
              />
            )
          )
        )}
      </div>

      <ReelComposerModal
        open={reelComposer?.open ?? false}
        onClose={() => reelComposer?.closeComposer()}
        onSubmit={handleSubmit}
        initial={reelComposer?.initial}
      />
    </div>
  );
}

export function ReelsPage() {
  return (
    <ReelComposerProvider>
      <ReelsPageInner />
    </ReelComposerProvider>
  );
}
