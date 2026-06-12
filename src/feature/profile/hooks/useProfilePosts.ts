"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { CURRENT_USER } from "@/feature/feed/data/constants";
import { useOtherUserPosts } from "@/feature/feed/data/useOtherUserPosts";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { useProfileView } from "../context/ProfileViewContext";

export function useProfilePosts() {
  const view = useProfileView();
  const authUserId = useAuthStore((s) => s.userId);
  const selfPosts = useUserPosts();
  const ownerId = view.isSelf
    ? authUserId || CURRENT_USER.id
    : view.personId;
  const otherPosts = useOtherUserPosts(ownerId, !view.isSelf);

  return {
    ...selfPosts,
    posts: view.isSelf
      ? selfPosts.posts.filter(
          (post) => (post.ownerId ?? post.author.id) === ownerId,
        )
      : otherPosts.posts,
    hydrated: view.isSelf ? selfPosts.hydrated : otherPosts.hydrated,
    isSelf: view.isSelf,
    ownerId,
  };
}
