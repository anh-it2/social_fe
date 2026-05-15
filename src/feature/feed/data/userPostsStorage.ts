"use client";

import type { FeedPostData } from "./types";
import { readFeedSlice, writeFeedSlice } from "./feedStorage";

export const FEED_POSTS_CHANGED_EVENT = "feed:posts-changed";

export function loadUserPostsFromStorage(): FeedPostData[] {
  return readFeedSlice("userPosts") as FeedPostData[];
}

export function saveUserPostsToStorage(posts: FeedPostData[]) {
  writeFeedSlice("userPosts", posts);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FEED_POSTS_CHANGED_EVENT));
  }
}
