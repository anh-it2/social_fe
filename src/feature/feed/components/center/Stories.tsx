"use client";

import { Flex } from "antd";
import { useState } from "react";
import { STORIES } from "../../data/constants";
import type { ReelData } from "../../data/types";
import { CreateStoryCard } from "./CreateStoryCard";
import { ReelCard } from "./ReelCard";
import { ReelComposerModal } from "./ReelComposerModal";
import { StoryCard } from "./StoryCard";

export function Stories() {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);

  const handleSubmit = (reel: ReelData) => {
    setReels((prev) => [reel, ...prev]);
  };

  return (
    <>
      <Flex
        gap={8}
        className="no-scrollbar !w-full !overflow-x-auto !rounded-xl !p-2"
        style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          height: 202,
        }}
      >
        <CreateStoryCard onClick={() => setComposerOpen(true)} />
        {reels.map((r) => (
          <ReelCard key={r.id} reel={r} />
        ))}
        {STORIES.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </Flex>
      <ReelComposerModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
