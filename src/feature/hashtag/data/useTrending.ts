"use client";

import { useEffect, useMemo, useState } from "react";
import { FEED_POSTS } from "@/feature/feed/data/constants";
import type { FeedPostData } from "@/feature/feed/data/types";
import {
  FEED_POSTS_CHANGED_EVENT,
  loadUserPostsFromStorage,
} from "@/feature/feed/data/userPostsStorage";
import { extractHashtags } from "../lib/parse";

export interface TrendingTag {
  tag: string;
  count: number;
}

function aggregate(posts: FeedPostData[]): TrendingTag[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const tag of extractHashtags(p.text)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    if (p.sharedFrom) {
      for (const tag of extractHashtags(p.sharedFrom.text)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function useAllPostsForHashtags() {
  const [userPosts, setUserPosts] = useState<FeedPostData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserPosts(loadUserPostsFromStorage());
    setHydrated(true);

    const refresh = () => setUserPosts(loadUserPostsFromStorage());
    window.addEventListener("storage", refresh);
    window.addEventListener(FEED_POSTS_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(FEED_POSTS_CHANGED_EVENT, refresh);
    };
  }, []);

  const posts = useMemo(
    () => [...userPosts, ...FEED_POSTS],
    [userPosts],
  );

  return { posts, hydrated };
}

export function useTrending(limit = 6): {
  trending: TrendingTag[];
  hydrated: boolean;
} {
  const { posts, hydrated } = useAllPostsForHashtags();
  const trending = useMemo(() => aggregate(posts).slice(0, limit), [posts, limit]);
  return { trending, hydrated };
}

export function usePostsByHashtag(tag: string): {
  posts: FeedPostData[];
  hydrated: boolean;
} {
  const { posts, hydrated } = useAllPostsForHashtags();
  const lowered = tag.toLowerCase();
  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const inSelf = extractHashtags(p.text).includes(lowered);
        const inShared = p.sharedFrom
          ? extractHashtags(p.sharedFrom.text).includes(lowered)
          : false;
        return inSelf || inShared;
      }),
    [posts, lowered],
  );
  return { posts: filtered, hydrated };
}
