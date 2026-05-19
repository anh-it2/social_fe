import { apiClient } from "@/shared/lib/apiClient";
import type { PostListResponseDTO } from "../dto/post.dto";
import { toFeedPostData } from "../dto/post.mapper";
import type { FeedPostData } from "../data/types";

/** A specific user's posts (viewing someone else's profile). */
export async function getUserPostsService(
  userId: string,
): Promise<FeedPostData[]> {
  const res = await apiClient.get<PostListResponseDTO>(
    `/api/posts?authorId=${encodeURIComponent(userId)}`,
  );
  return res.data.posts.map(toFeedPostData);
}
