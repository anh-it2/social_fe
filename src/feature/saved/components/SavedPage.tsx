"use client";

import { App, Button, Flex, Typography } from "antd";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { REEL_RECOMMENDS } from "@/feature/feed/data/constants";
import { FeedPost } from "@/feature/feed/components/center/post/FeedPost";
import {
  useSavedPosts,
  useSavedReels,
} from "@/feature/feed/data/useSavedReels";
import { useUserReels } from "@/feature/feed/data/useUserReels";
import { Icon } from "@/shared/components/Icon";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { SavedReelCard } from "./SavedReelCard";

const { Title, Text } = Typography;

export function SavedPage() {
  const t = useTranslations("Feed.savedPage");
  const locale = useLocale();
  const { message } = App.useApp();
  const { entries, removeSaved } = useSavedReels();
  const { entries: savedPosts } = useSavedPosts();
  const { reels: userReels } = useUserReels();

  const resolved = useMemo(() => {
    return entries
      .map((e) => {
        if (e.kind === "user") {
          const r = userReels.find((u) => u.id === e.id);
          if (!r) return null;
          return { key: `u-${e.id}`, kind: "user" as const, reel: r };
        }
        const r = REEL_RECOMMENDS.find((rr) => rr.id === e.id);
        if (!r) return null;
        return { key: `r-${e.id}`, kind: "recommend" as const, reel: r };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [entries, userReels]);

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <TopNav />
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !max-w-[1100px] !flex-1 !px-3 !py-4 sm:!px-6 sm:!py-6"
      >
        <Flex align="center" gap={10} className="!min-w-0">
          <Icon name="bookmark" size={26} color="var(--color-primary)" />
          <Title
            level={3}
            className="!m-0 !text-[22px] !font-bold text-[var(--color-text)]"  >
            {t("title")}
          </Title>
        </Flex>

        <Flex
          vertical
          gap={12}
          className="!w-full !rounded-xl !p-4 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
          <Flex align="center" justify="space-between" className="!w-full">
            <Text
              className="!text-[16px] !font-semibold text-[var(--color-text)]"  >
              {t("savedPosts")}
            </Text>
            <Link href={`/${locale}`}>
              <Text
                className="!text-[13px] !font-semibold text-[var(--color-primary)]"  >
                {t("openFeed")}
              </Text>
            </Link>
          </Flex>

          {savedPosts.length === 0 ? (
            <Flex
              vertical
              align="center"
              justify="center"
              gap={12}
              className="!w-full !py-12"
            >
              <Icon
                name="bookmark_border"
                size={48}
                color="var(--color-text-muted)"
              />
              <Text
                className="!text-[14px] !text-center text-[var(--color-text-muted)]"  >
                {t("emptyPosts")}
              </Text>
            </Flex>
          ) : (
            <Flex vertical gap={16} className="!w-full">
              {savedPosts.map((e) => (
                <FeedPost key={e.post.id} post={e.post} />
              ))}
            </Flex>
          )}
        </Flex>

        <Flex
          vertical
          gap={12}
          className="!w-full !rounded-xl !p-4 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
          <Flex align="center" justify="space-between" className="!w-full">
            <Text
              className="!text-[16px] !font-semibold text-[var(--color-text)]"  >
              {t("savedReels")}
            </Text>
            <Link href={`/${locale}/reels`}>
              <Text
                className="!text-[13px] !font-semibold text-[var(--color-primary)]"  >
                {t("openReels")}
              </Text>
            </Link>
          </Flex>

          {resolved.length === 0 ? (
            <Flex
              vertical
              align="center"
              justify="center"
              gap={12}
              className="!w-full !py-12"
            >
              <Icon
                name="bookmark_border"
                size={48}
                color="var(--color-text-muted)"
              />
              <Text
                className="!text-[14px] !text-center text-[var(--color-text-muted)]"  >
                {t("empty")}
              </Text>
              <Link href={`/${locale}/reels`}>
                <Button
                  type="primary"
                  className="!h-9 !rounded-[10px] !font-semibold"
                >
                  {t("openReels")}
                </Button>
              </Link>
            </Flex>
          ) : (
            <div
              className="!grid !w-full !gap-3 [grid-template-columns:repeat(auto-fill,_minmax(180px,_1fr))]"  >
              {resolved.map((it) => (
                <SavedReelCard
                  key={it.key}
                  kind={it.kind}
                  reel={it.reel}
                  onRemove={() => {
                    removeSaved(it.kind, it.reel.id);
                    message.info(t("removed"));
                  }}
                />
              ))}
            </div>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
