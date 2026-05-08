"use client";

import { Flex } from "antd";
import { useState } from "react";
import { FEED_POSTS } from "../../data/constants";
import type { FeedPostData } from "../../data/types";
import { Composer } from "./Composer";
import { FeedPost } from "./FeedPost";
import { Stories } from "./Stories";

export function CenterFeed() {
  const [posts, setPosts] = useState<FeedPostData[]>(FEED_POSTS);

  const handleCreate = (post: FeedPostData) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <Flex
      vertical
      gap={16}
      className="!min-w-0 !flex-1 !px-10 !py-5"
      style={{ background: "var(--color-bg)" }}
    >
      <Stories />
      <Composer onCreatePost={handleCreate} />
      {posts.map((p) => (
        <FeedPost key={p.id} post={p} />
      ))}
    </Flex>
  );
}
