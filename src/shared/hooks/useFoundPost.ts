"use client";

import { useEffect, useState } from "react";
import type { FeedPostData } from "@/feature/feed/data/types";
import { getPostService } from "@/feature/feed/services/queries/getPost.service";
import { findPostById } from "@/shared/lib/findPost";

export function useFoundPost(id: string): {
  post: FeedPostData | null;
  ready: boolean;
} {
  const [ready, setReady] = useState(false);
  const [post, setPost] = useState<FeedPostData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const local = findPostById(id);
    if (local) {
      setPost(local);
      setReady(true);
      return;
    }
    setReady(false);
    setPost(null);
    getPostService(id)
      .then((fetched) => {
        if (cancelled) return;
        setPost(fetched);
      })
      .catch(() => {
        if (cancelled) return;
        setPost(null);
      })
      .finally(() => {
        if (cancelled) return;
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { post, ready };
}
