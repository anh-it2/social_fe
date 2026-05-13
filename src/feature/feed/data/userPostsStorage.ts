"use client";

import type { FeedPostData } from "./types";
import { readFeedSlice, writeFeedSlice } from "./feedStorage";

export function loadUserPostsFromStorage(): FeedPostData[] {
  return readFeedSlice("userPosts") as FeedPostData[];
}

export function saveUserPostsToStorage(posts: FeedPostData[]) {
  writeFeedSlice("userPosts", posts);
}
