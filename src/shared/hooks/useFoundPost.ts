"use client";

import { useEffect, useState } from "react";
import type { FeedPostData } from "@/feature/feed/data/types";
import { findPostById } from "@/shared/lib/findPost";

export function useFoundPost(id: string): {
  post: FeedPostData | null;
  ready: boolean;
} {
  const [ready, setReady] = useState(false);
  const [post, setPost] = useState<FeedPostData | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPost(findPostById(id));
    setReady(true);
  }, [id]);

  return { post, ready };
}
