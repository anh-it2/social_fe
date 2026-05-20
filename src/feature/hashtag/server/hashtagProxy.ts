import type { NextRequest, NextResponse } from "next/server";
import type { PostDTO } from "@/feature/feed/dto/post.dto";
import { callBackend } from "@/shared/lib/beProxy";
import type { HashtagTrendingDTO } from "../dto/hashtag.dto";

const RESOURCE = "hashtag";

export function forwardTrending(
  req: NextRequest,
  limit: number,
): Promise<NextResponse> {
  return callBackend<HashtagTrendingDTO[], { tags: HashtagTrendingDTO[] }>({
    req,
    method: "get",
    path: `/hashtags/trending?limit=${encodeURIComponent(String(limit))}`,
    shape: (tags) => ({ tags }),
    resource: RESOURCE,
  });
}

export function forwardPostsByTag(
  req: NextRequest,
  tag: string,
): Promise<NextResponse> {
  return callBackend<PostDTO[], { posts: PostDTO[] }>({
    req,
    method: "get",
    path: `/hashtags/${encodeURIComponent(tag)}/posts`,
    shape: (posts) => ({ posts }),
    resource: RESOURCE,
  });
}
