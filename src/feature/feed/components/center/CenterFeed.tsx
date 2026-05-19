"use client";

import { Flex } from "antd";
import { Fragment, useEffect, useState } from "react";
import type { FeedPostData, ReelData } from "../../data/types";
import { useFeed } from "../../data/useFeed";
import { useUserReels } from "../../data/useUserReels";
import { ReelComposerProvider, useReelComposer } from "../../lib/reelComposer";
import { Composer } from "./composer/Composer";
import { PeopleYouMayKnowCard } from "./people-you-may-know/PeopleYouMayKnowCard";
import { FeedPost } from "./post/FeedPost";
import { ReelComposerModal } from "./reels/ReelComposerModal";
import { ReelsForYouCard } from "./reels-for-you/ReelsForYouCard";
import { Stories } from "./stories/Stories";

function FeedReelComposerHost() {
  const reelComposer = useReelComposer();
  const { addReel } = useUserReels();
  const handleSubmit = (reel: ReelData) => {
    addReel(reel);
  };
  return (
    <ReelComposerModal
      open={reelComposer?.open ?? false}
      onClose={() => reelComposer?.closeComposer()}
      onSubmit={handleSubmit}
      initial={reelComposer?.initial}
    />
  );
}

export function CenterFeed() {
  // Global feed, server-backed and server-ordered (pinned first, then
  // newest). All writes go through the API; the old localStorage+mock mix
  // and the user-vs-mock branching are gone (the BE authorizes edits).
  const { posts: allPosts, addPost, removePost, updatePost, pinPost } =
    useFeed();

  const [suggestionsAt, setSuggestionsAt] = useState<number | null>(null);
  useEffect(() => {
    if (allPosts.length === 0) {
      setSuggestionsAt(null);
      return;
    }
    const max = Math.min(3, allPosts.length);
    setSuggestionsAt(1 + Math.floor(Math.random() * max));
    // pick once per mount; intentionally not reactive to allPosts changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = (post: FeedPostData) => addPost(post);

  const handleRemove = (id: string) => removePost(id);

  const handleUpdate = (updated: FeedPostData) => updatePost(updated);

  const handlePinToggle = (id: string) => {
    const target = allPosts.find((p) => p.id === id);
    return pinPost(id, !target?.pinnedAt);
  };

  return (
    <ReelComposerProvider>
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !min-w-0 !max-w-[680px] !flex-1 !px-2 !py-3 sm:!px-4 sm:!py-4 lg:!max-w-none lg:!px-10 lg:!py-5 bg-[var(--color-bg)]"  >
        <Stories />
        <Composer onCreatePost={handleCreate} />
        <ReelsForYouCard />
        {allPosts.map((p, idx) => (
          <Fragment key={p.id}>
            {idx === suggestionsAt ? <PeopleYouMayKnowCard /> : null}
            <FeedPost
              post={p}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
              onShareToProfile={addPost}
              onPinToggle={handlePinToggle}
            />
          </Fragment>
        ))}
        {suggestionsAt !== null && suggestionsAt >= allPosts.length ? (
          <PeopleYouMayKnowCard />
        ) : null}
      </Flex>
      <FeedReelComposerHost />
    </ReelComposerProvider>
  );
}
