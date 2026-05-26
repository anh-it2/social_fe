import { apiClient } from "@/shared/lib/apiClient";
import type { CreatePostBody, PostResponseDTO } from "../../dto/post.dto";
import { toFeedPostData } from "../../dto/post.mapper";
import type { FeedPostData } from "../../data/types";

/** Creates a post; resolves with the persisted post (BE-assigned id). */
export async function createPostService(
  body: CreatePostBody,
): Promise<FeedPostData> {
  const res = await apiClient.post<PostResponseDTO>("/api/posts", body);
  return toFeedPostData(res.data.post);
}
