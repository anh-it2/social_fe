"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { STORIES } from "../../../data/constants";
import type { ReelData } from "../../../data/types";
import { useUserStories } from "../../../data/useUserStories";
import { useCurrentUserIdentity } from "../../../hooks/useCurrentUserIdentity";
import { ReelComposerModal } from "../reels/ReelComposerModal";
import { CreateStoryCard } from "./CreateStoryCard";
import { StoryCard } from "./StoryCard";

export function Stories() {
  const t = useTranslations("Feed.story");
  const currentUser = useCurrentUserIdentity();
  const { stories: userStories, addStory } = useUserStories();
  const [composerOpen, setComposerOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };

  const handleCreateStory = (reel: ReelData) => {
    const author = reel.author ?? currentUser;
    addStory({
      id: `us-${reel.id}`,
      initial: author.initial,
      name: author.name,
      bgGradient: author.gradient,
      avatarColor: author.gradient[1],
      mediaUrl: reel.mediaUrl,
      mediaType: reel.mediaType,
      musicId: reel.musicId,
      caption: reel.caption,
      createdAt: Date.now(),
    });
    requestAnimationFrame(() => {
      scrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      updateArrows();
    });
  };

  return (
    <div
      className="!relative !w-full !rounded-xl bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] h-[202px]"  >
      <Flex
        gap={8}
        ref={scrollerRef}
        className="no-scrollbar !h-full !w-full !overflow-x-auto !p-2"
      >
        <CreateStoryCard onClick={() => setComposerOpen(true)} />
        {userStories.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
        {STORIES.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </Flex>
      <Button
        shape="circle"
        aria-label={t("scrollLeft")}
        onClick={() => scrollBy(-1)}
        icon={<Icon className="bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]" name="chevron_left" size={22} color="var(--color-text)" />}
        className={
          "!absolute !left-2 !top-1/2 !z-10 !hidden !h-9 !w-9 -translate-y-1/2 !shadow-md !transition-opacity sm:!flex !items-center !justify-center " +
          (canLeft ? "!opacity-100" : "!pointer-events-none !opacity-0")
        }  />
      <Button
        shape="circle"
        aria-label={t("scrollRight")}
        onClick={() => scrollBy(1)}
        icon={<Icon className="bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]" name="chevron_right" size={22} color="var(--color-text)" />}
        className={
          "!absolute !right-2 !top-1/2 !z-10 !hidden !h-9 !w-9 -translate-y-1/2 !shadow-md !transition-opacity sm:!flex !items-center !justify-center " +
          (canRight ? "!opacity-100" : "!pointer-events-none !opacity-0")
        }  />
      <ReelComposerModal
        mode="story"
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreateStory}
      />
    </div>
  );
}
