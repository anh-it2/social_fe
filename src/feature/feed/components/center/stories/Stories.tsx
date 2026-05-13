"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { CURRENT_USER, STORIES } from "../../../data/constants";
import type { ReelData } from "../../../data/types";
import { useUserStories } from "../../../data/useUserStories";
import { ReelComposerModal } from "../reels/ReelComposerModal";
import { CreateStoryCard } from "./CreateStoryCard";
import { StoryCard } from "./StoryCard";

export function Stories() {
  const t = useTranslations("Feed.story");
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
    addStory({
      id: `us-${reel.id}`,
      initial: CURRENT_USER.initial,
      name: CURRENT_USER.name,
      bgGradient: CURRENT_USER.gradient,
      avatarColor: CURRENT_USER.gradient[1],
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
      className="!relative !w-full !rounded-xl"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        height: 202,
      }}
    >
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
        icon={<Icon name="chevron_left" size={22} color="var(--color-text)" />}
        className={
          "!absolute !left-2 !top-1/2 !z-10 !hidden !h-9 !w-9 -translate-y-1/2 !shadow-md !transition-opacity sm:!flex !items-center !justify-center " +
          (canLeft ? "!opacity-100" : "!pointer-events-none !opacity-0")
        }
        style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
        }}
      />
      <Button
        shape="circle"
        aria-label={t("scrollRight")}
        onClick={() => scrollBy(1)}
        icon={<Icon name="chevron_right" size={22} color="var(--color-text)" />}
        className={
          "!absolute !right-2 !top-1/2 !z-10 !hidden !h-9 !w-9 -translate-y-1/2 !shadow-md !transition-opacity sm:!flex !items-center !justify-center " +
          (canRight ? "!opacity-100" : "!pointer-events-none !opacity-0")
        }
        style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
        }}
      />
      <ReelComposerModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreateStory}
      />
    </div>
  );
}
