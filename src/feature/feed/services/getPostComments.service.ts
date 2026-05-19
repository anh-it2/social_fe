import { apiClient } from "@/shared/lib/apiClient";
import type { CommentListResponseDTO } from "../dto/post.dto";
import { toFeedComment } from "../dto/post.mapper";
import type { FeedComment } from "../data/types";

/** A post's comments, oldest → newest. */
export async function getPostCommentsService(
  postId: string,
): Promise<FeedComment[]> {
  const res = await apiClient.get<CommentListResponseDTO>(
    `/api/posts/${encodeURIComponent(postId)}/comments`,
  );
  return res.data.comments.map(toFeedComment);
}
