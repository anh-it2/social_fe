"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostCommentsService } from "../services/queries/getPostComments.service";
import { postCommentsKey } from "./usePostMutations";

/**
 * A post's comments, server-backed. Lazy: pass `enabled` so the request only
 * fires when the comment section is actually opened. Invalidated by the
 * add-comment mutation and by the /feed realtime listener.
 */
export function usePostComments(postId: string, enabled: boolean) {
  const query = useQuery({
    queryKey: postCommentsKey(postId),
    queryFn: () => getPostCommentsService(postId),
    enabled,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    comments: query.data ?? [],
    loading: query.isFetching && !query.data,
  };
}
