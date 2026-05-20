"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { FeedPostData } from "@/feature/feed/data/types";
import { getPostsByTagService } from "../services/getPostsByTag.service";
import { getTrendingService } from "../services/getTrending.service";

// Stable prefix so usePostMutations can blow away every trending/tag-page
// cache with one invalidateQueries({ queryKey: HASHTAG_QUERY_PREFIX }).
export const HASHTAG_QUERY_PREFIX = ["hashtags"] as const;
export const trendingKey = (limit: number) =>
  ["hashtags", "trending", limit] as const;
export const postsByTagKey = (tag: string) =>
  ["hashtags", "posts", tag.toLowerCase()] as const;

export interface TrendingTag {
  tag: string;
  count: number;
}

export function useTrending(limit = 6): {
  trending: TrendingTag[];
  hydrated: boolean;
} {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const { data, isLoading } = useQuery({
    queryKey: trendingKey(limit),
    queryFn: () => getTrendingService(limit),
    enabled: isLoggined,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { trending: data ?? [], hydrated: !isLoading };
}

export function usePostsByHashtag(tag: string): {
  posts: FeedPostData[];
  hydrated: boolean;
} {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const { data, isLoading } = useQuery({
    queryKey: postsByTagKey(tag),
    queryFn: () => getPostsByTagService(tag),
    enabled: isLoggined && tag.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { posts: data ?? [], hydrated: !isLoading };
}
