import { apiClient } from "@/shared/lib/apiClient";
import type { PostListResponseDTO } from "../../dto/post.dto";
import { toFeedPostData } from "../../dto/post.mapper";
import type { FeedPostData } from "../../data/types";

/** The current user's own posts (profile / photos / stats surfaces). */
export async function getMyPostsService(): Promise<FeedPostData[]> {
  const res = await apiClient.get<PostListResponseDTO>("/api/posts?mine=1");
  return res.data.posts.map(toFeedPostData);
}
