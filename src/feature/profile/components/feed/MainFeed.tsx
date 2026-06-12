"use client";

import { Flex } from "antd";
import { Composer } from "@/feature/feed/components/center/composer/Composer";
import { FeedPost } from "@/feature/feed/components/center/post/FeedPost";
import type { FeedPostData } from "@/feature/feed/data/types";
import { usePostMutations } from "@/feature/feed/data/usePostMutations";
import { useProfilePosts } from "../../hooks/useProfilePosts";

export function MainFeed() {
  const {
    posts,
    addPost,
    removePost,
    updatePost,
    isSelf,
  } = useProfilePosts();
  const { pinPost } = usePostMutations();

  const handleCreate = (post: FeedPostData) => addPost(post);
  const handleRemove = (id: string) => removePost(id);
  const handleUpdate = (post: FeedPostData) => updatePost(post);
  const handlePinToggle = (id: string) => {
    const target = posts.find((p) => p.id === id);
    return pinPost(id, !target?.pinnedAt);
  };

  return (
    <Flex vertical gap={20} className="!flex-1">
      {isSelf ? <Composer onCreatePost={handleCreate} /> : null}
      {posts.map((p) => (
        <FeedPost
          key={p.id}
          post={p}
          onRemove={isSelf ? handleRemove : undefined}
          onUpdate={isSelf ? handleUpdate : undefined}
          onShareToProfile={isSelf ? addPost : undefined}
          onPinToggle={isSelf ? handlePinToggle : undefined}
        />
      ))}
    </Flex>
  );
}
