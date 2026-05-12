"use client";

import { Flex } from "antd";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FEED_POSTS } from "../../data/constants";
import type { FeedPostData, ReelData } from "../../data/types";
import { useUserPosts } from "../../data/useUserPosts";
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
  const { posts: userPosts, addPost, removePost, updatePost } = useUserPosts();
  const [mockPosts, setMockPosts] = useState<FeedPostData[]>(FEED_POSTS);

  const allPosts = useMemo(
    () => [...userPosts, ...mockPosts],
    [userPosts, mockPosts]
  );

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

  const isUserPost = (id: string) => userPosts.some((p) => p.id === id);

  const handleCreate = (post: FeedPostData) => {
    addPost(post);
  };

  const handleRemove = (id: string) => {
    if (isUserPost(id)) {
      removePost(id);
      return;
    }
    setMockPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = (updated: FeedPostData) => {
    if (isUserPost(updated.id)) {
      updatePost(updated);
      return;
    }
    setMockPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <ReelComposerProvider>
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !min-w-0 !max-w-[680px] !flex-1 !px-2 !py-3 sm:!px-4 sm:!py-4 lg:!max-w-none lg:!px-10 lg:!py-5"
        style={{ background: "var(--color-bg)" }}
      >
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
