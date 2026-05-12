import { FEED_POSTS } from "@/feature/feed/data/constants";
import type { FeedPostData } from "@/feature/feed/data/types";
import { loadUserPostsFromStorage } from "@/feature/feed/data/userPostsStorage";
import { POSTS as PROFILE_POSTS } from "@/feature/profile/data/mock";
import type { Post as ProfilePost } from "@/feature/profile/data/mock";

function initialOf(name: string): string {
  return (name.trim()[0] ?? "?").toUpperCase();
}

function toFeedPost(p: ProfilePost): FeedPostData {
  return {
    id: p.id,
    ownerId: p.ownerId,
    author: {
      id: p.ownerId,
      name: p.author.name,
      initial: initialOf(p.author.name),
      gradient: p.author.gradient ?? ["#4096ff", "#a855f7"],
    },
    time: p.time,
    text: p.text,
    imageUrl: p.image,
    likes: String(p.likes),
    comments: p.comments,
    shares: p.shares,
  };
}

export function findPostById(id: string): FeedPostData | null {
  const userPosts = loadUserPostsFromStorage();
  const up = userPosts.find((p) => p.id === id);
  if (up) return up;
  const fp = FEED_POSTS.find((p) => p.id === id);
  if (fp) return fp;
  const pp = PROFILE_POSTS.find((p) => p.id === id);
  if (pp) return toFeedPost(pp);
  return null;
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
