"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserPostsService } from "../services/getUserPosts.service";

/**
 * A specific user's posts, server-backed (social-platform-be via
 * /api/posts?authorId=). Used when viewing someone else's profile. The
 * query key is under the "posts" prefix so post mutations (react/comment)
 * invalidate it too.
 */
export function useOtherUserPosts(
  userId: string | undefined,
  enabled: boolean,
) {
  const query = useQuery({
    queryKey: ["posts", "user", userId],
    queryFn: () => getUserPostsService(userId!),
    enabled: enabled && !!userId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    posts: query.data ?? [],
    hydrated: query.isFetched,
  };
}
