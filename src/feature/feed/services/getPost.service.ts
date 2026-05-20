import { apiClient } from "@/shared/lib/apiClient";
import type { PostResponseDTO } from "../dto/post.dto";
import { toFeedPostData } from "../dto/post.mapper";
import type { FeedPostData } from "../data/types";

export async function getPostService(id: string): Promise<FeedPostData> {
  const res = await apiClient.get<PostResponseDTO>(
    `/api/posts/${encodeURIComponent(id)}`,
  );
  return toFeedPostData(res.data.post);
}
