"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getMyPostsService } from "../services/getMyPosts.service";
import {
  POSTS_MINE_KEY,
  POSTS_QUERY_PREFIX,
  usePostMutations,
} from "./usePostMutations";

/**
 * The current user's own posts, server-backed (social-platform-be via
 * /api/posts?mine=1) — formerly localStorage `feed:<userId>`. The public
 * shape ({ posts, hydrated, addPost, removePost, updatePost }) is unchanged
 * so every consumer (profile feed/photos/videos/stats, saved, trending,
 * reels) keeps working; the write fns now persist to the DB and resolve
 * with the saved post.
 */
export function useUserPosts() {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: POSTS_MINE_KEY,
    queryFn: getMyPostsService,
    enabled: isLoggined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { addPost, removePost, updatePost } = usePostMutations();

  // Admin report-removal fan-out (same-tab BroadcastChannel). The post is
  // already gone server-side; just drop our cached copy by refetching.
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const ch = new BroadcastChannel("admin:report");
    const handler = (e: MessageEvent) => {
      const data = e.data as { type?: string } | undefined;
      if (data?.type === "post-removed") {
        queryClient.invalidateQueries({ queryKey: POSTS_QUERY_PREFIX });
      }
    };
    ch.addEventListener("message", handler);
    return () => {
      ch.removeEventListener("message", handler);
      ch.close();
    };
  }, [queryClient]);

  return {
    posts: query.data ?? [],
    hydrated: query.isFetched,
    addPost,
    removePost,
    updatePost,
  };
}
