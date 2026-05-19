"use client";

import { Flex } from "antd";
import { useMemo } from "react";
import { Composer } from "@/feature/feed/components/center/composer/Composer";
import { FeedPost } from "@/feature/feed/components/center/post/FeedPost";
import { CURRENT_USER } from "@/feature/feed/data/constants";
import type { FeedPostData } from "@/feature/feed/data/types";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { useOtherUserPosts } from "@/feature/feed/data/useOtherUserPosts";
import { usePostMutations } from "@/feature/feed/data/usePostMutations";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useProfileView } from "../../context/ProfileViewContext";

export function MainFeed() {
  const { posts: myPosts, addPost, removePost, updatePost } = useUserPosts();
  const { pinPost } = usePostMutations();
  const view = useProfileView();
  const authUserId = useAuthStore((s) => s.userId);
  const myId = authUserId || CURRENT_USER.id;
  // whose profile this is: self => my id, other => their id
  const ownerId = view.isSelf ? myId : view.personId;

  const { posts: otherPosts } = useOtherUserPosts(ownerId, !view.isSelf);

  const posts = useMemo<FeedPostData[]>(() => {
    if (view.isSelf) {
      return myPosts.filter((p) => (p.ownerId ?? p.author.id) === ownerId);
    }
    return otherPosts;
  }, [view.isSelf, myPosts, ownerId, otherPosts]);

  const handleCreate = (post: FeedPostData) => addPost(post);
  const handleRemove = (id: string) => removePost(id);
  const handleUpdate = (post: FeedPostData) => updatePost(post);
  const handlePinToggle = (id: string) => {
    const target = posts.find((p) => p.id === id);
    return pinPost(id, !target?.pinnedAt);
  };

  return (
    <Flex vertical gap={20} className="!flex-1">
      {view.isSelf ? <Composer onCreatePost={handleCreate} /> : null}
      {posts.map((p) => (
        <FeedPost
          key={p.id}
          post={p}
          onRemove={handleRemove}
          onUpdate={handleUpdate}
          onShareToProfile={addPost}
          onPinToggle={handlePinToggle}
        />
      ))}
    </Flex>
  );
}
