import type { FeedPostData } from "@/feature/feed/data/types";
import { loadUserPostsFromStorage } from "@/feature/feed/data/userPostsStorage";

export function findPostById(id: string): FeedPostData | null {
  const userPosts = loadUserPostsFromStorage();
  return userPosts.find((p) => p.id === id) ?? null;
}

export function extractInternalPostId(url: string): string | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/posts\/([^/?#]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
