import { apiClient } from "@/shared/lib/apiClient";
import type { PostListResponseDTO } from "../dto/post.dto";
import { toFeedPostData } from "../dto/post.mapper";
import type { FeedPostData } from "../data/types";

/** The global feed (all users), newest-first, pinned on top. */
export async function getFeedService(): Promise<FeedPostData[]> {
  const res = await apiClient.get<PostListResponseDTO>("/api/posts");
  return res.data.posts.map(toFeedPostData);
}
