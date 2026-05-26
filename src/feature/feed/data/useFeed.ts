"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getFeedService } from "../services/queries/getFeed.service";
import { POSTS_FEED_KEY, usePostMutations } from "./usePostMutations";

/**
 * The global feed (all users), server-backed — replaces the old
 * `[...userPosts, ...FEED_POSTS]` localStorage+mock mix in CenterFeed.
 * Newest-first with pinned posts on top (server-ordered). Exposes the shared
 * write-ops so CenterFeed creates/edits/pins/removes through the API.
 */
export function useFeed() {
  const isLoggined = useAuthStore((s) => s.isLoggined);

  const query = useQuery({
    queryKey: POSTS_FEED_KEY,
    queryFn: getFeedService,
    enabled: isLoggined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { addPost, updatePost, removePost, pinPost } = usePostMutations();

  return {
    posts: query.data ?? [],
    hydrated: query.isFetched,
    addPost,
    updatePost,
    removePost,
    pinPost,
  };
}
