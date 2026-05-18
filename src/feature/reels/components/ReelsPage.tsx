"use client";

import { App, Flex, Typography } from "antd";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { REEL_RECOMMENDS } from "@/feature/feed/data/constants";
import { useSavedReels } from "@/feature/feed/data/useSavedReels";
import { useUserReels } from "@/feature/feed/data/useUserReels";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { ReelFullCard } from "./ReelFullCard";

export function ReelsPage() {
  const t = useTranslations("Feed.reelsPage");
  const searchParams = useSearchParams();
  const focusId = searchParams.get("id");
  const { reels: userReels } = useUserReels();
  const { isSaved, toggleSaved } = useSavedReels();
  const { message } = App.useApp();
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    const userItems = userReels.map((r) => ({ kind: "user" as const, reel: r }));
    const recItems = REEL_RECOMMENDS.map((r) => ({
      kind: "recommend" as const,
      reel: r,
    }));
    const all = [...userItems, ...recItems];
    if (!focusId) return all;
    const idx = all.findIndex((it) => it.reel.id === focusId);
    if (idx <= 0) return all;
    return [all[idx], ...all.slice(0, idx), ...all.slice(idx + 1)];
  }, [userReels, focusId]);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <TopNav />
      <div
        className="!w-full !overflow-y-auto !snap-y !snap-mandatory no-scrollbar [height:calc(100dvh_-_64px)] bg-[#000] [scroll-behavior:smooth]"  >
        {items.length === 0 ? (
          <Flex
            align="center"
            justify="center"
            className="!h-full !w-full"
          >
            <Typography.Text
              className="!text-[14px] text-[rgba(255,255,255,0.7)]"  >
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
                saved={isSaved("user", it.reel.id)}
                onSaveToggle={() => {
                  const wasSaved = isSaved("user", it.reel.id);
                  toggleSaved("user", it.reel.id);
                  message.success(wasSaved ? t("unsaved") : t("savedToast"));
                }}
              />
            ) : (
              <ReelFullCard
                key={`r-${it.reel.id}`}
                kind="recommend"
                reel={it.reel}
                liked={liked.has(it.reel.id)}
                onLikeToggle={() => toggleLike(it.reel.id)}
                saved={isSaved("recommend", it.reel.id)}
                onSaveToggle={() => {
                  const wasSaved = isSaved("recommend", it.reel.id);
                  toggleSaved("recommend", it.reel.id);
                  message.success(wasSaved ? t("unsaved") : t("savedToast"));
                }}
              />
            )
          )
        )}
      </div>
    </Flex>
  );
}
